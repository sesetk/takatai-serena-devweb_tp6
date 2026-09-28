import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import { NODE_ENV, PORT, log } from "./config.mjs";
import apiV1Router from "./router/api-v1.mjs";
import "./database/database.mjs";
import favicon from "serve-favicon";
import path from "path";
import apiV2Router from './router/api-v2.mjs';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';


const app = express();

app.disable("x-powered-by");

app.set('view engine', 'ejs'); // AJOUT

app.use(favicon(path.join(process.cwd(), "static", "logo_univ_16.png")));

app.use(morgan("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(
  express.static(path.join(process.cwd(), 'static'), { index: 'client.html' }),
);

app.use((req, res, next) => {
  res.set("X-API-version", "1.0.0");
  next();
});

const openApiDocument = parse(
  fs.readFileSync(path.join(process.cwd(), 'static', 'open-api.yaml'), 'utf8'),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api-v1", apiV1Router);

//app.use('/api-v2', cors());
app.use('/api-v2', apiV2Router); 

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
