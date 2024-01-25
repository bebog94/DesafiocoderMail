import mongoose from "mongoose";
import dotenv from 'dotenv';
import { logger } from "../../../utils/logger.js";

dotenv.config();

const { MONGODB_URI } = process.env;

mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info("Conectado a la base de datos"))
  .catch((error) => logger.error("Error al conectar con la Base de datos",error));



