import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import { NODE_ENV, PORT, log } from "./config.mjs";
import apiV1Router from "./router/api-v1.mjs";
import "./database/database.mjs";
import favicon from "serve-favicon";
import path from "path";

const app = express();

app.disable("x-powered-by");

app.use(favicon(path.join(process.cwd(), "static", "logo_univ_16.png")));

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  res.set("X-API-version", "1.0.0");
  next();
});

app.use("/api-v1", apiV1Router);

app.use((req, res, next) => {
  next(createError(404, "Route non trouvée"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: NODE_ENV === "development" ? err.stack : {},
  });
});

app.listen(PORT, () => {
  log.info(`Serveur démarré sur http://localhost:${PORT}`);
});
