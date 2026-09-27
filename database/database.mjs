import fs from 'fs';
import path from 'path';
import sqlite3pkg from 'sqlite3';
import { DB_FILE, DB_SCHEMA, log } from '../config.mjs';

const sqlite3 = sqlite3pkg.verbose();

const dbDir = path.dirname(DB_FILE);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbExisted = fs.existsSync(DB_FILE);

export const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    log.error('Erreur ouverture base de données :', err.message);
    return;
  }
  log.info(`Base de données connectée (${DB_FILE})`);

  if (!dbExisted) {
    const schema = fs.readFileSync(DB_SCHEMA, 'utf8');
    db.exec(schema, (err) => {
      if (err) {
        log.error('Erreur création du schéma :', err.message);
      } else {
        log.info('Schéma de base de données créé avec succès');
      }
    });
  }
});