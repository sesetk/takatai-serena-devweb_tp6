import dotenv from "dotenv";
import log from "loglevel";

dotenv.config();

export const PORT = process.env.PORT || 8080;
export const LINK_LEN = parseInt(process.env.LINK_LEN, 10) || 6;
export const DB_FILE = process.env.DB_FILE || "database/database.sqlite";
export const DB_SCHEMA = process.env.DB_SCHEMA || "database/database.sql";

log.setLevel(process.env.NODE_ENV === "production" ? "warn" : "debug");

export { log };


