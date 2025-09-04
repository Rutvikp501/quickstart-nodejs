// Logging Helper
export const log = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
};
import dotenv from "dotenv";
dotenv.config();
// ------------------ MongoDB ------------------
import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "node-boilerplate",
    });
    log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed  ", error);
    process.exit(1);
  }
};

// ------------------ MySQL ------------------
import mysql from "mysql2/promise";

export const connectMySQLDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "yourpassword",
      database: "yourdb",
    });
    log("MySQL Connected ✅");
    return connection;
  } catch (error) {
    console.error("MySQL connection failed  ", error);
    process.exit(1);
  }
};

// ------------------ PostgreSQL ------------------
import pkg from "pg";
const { Pool } = pkg;

export const connectPGDB = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT ? parseInt(process.env.DB_PORT) : 5432,
  ssl:
    process.env.PG_HOST && process.env.PG_HOST != "localhost"
      ? { ca: fs.readFileSync("global-bundle.pem").toString() }
      : false,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "postgres",
});

export const PGConnection = async () => {
  try {
    const client = await connectPGDB.connect();
    console.log("PostgreSQL Connected ✅");
    client.release();
  } catch (err) {
    console.error("PostgreSQL connection failed  ", err);
    process.exit(1);
  }
};
