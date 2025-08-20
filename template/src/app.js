import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import mainRoutes from './routes/main.routes.js';
import notFound from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import { connectMongoDB,PGConnection  } from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
    


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
const swaggerDocument = YAML.load('./config/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', mainRoutes);
app.use(notFound);
app.use(errorHandler);

await connectMongoDB();
// await connectMySQLDB();
await PGConnection();

export default app;
