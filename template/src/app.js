import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from "passport";
import mainRoutes from './routes/main.routes.js';
import notFound from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import { connectMongoDB  } from './config/db.js';
// import PGConnection from './config/db.js';
// import connectMySQLDB   from './config/db.js';
import "./auth/google.Oauth.js";// Google OAuth
import "./auth/facebook.Oauth.js";// Facebook OAuth
import "./auth/github.Oauth.js";// GitHub OAuth
import "./controllers/cron.Controller.js";// cron jobs

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = YAML.load(path.join(__dirname, '../src/config/swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', mainRoutes);
// ✅ Basic check route (after API)
app.get('/', (req, res) => {
  res.send('Welcome to server ..!');
});

app.use(notFound);
app.use(errorHandler);



await connectMongoDB();
// await connectMySQLDB();
// await PGConnection();

export default app;
