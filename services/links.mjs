import createError from 'http-errors';
import { randomInt } from 'crypto';
import { LINK_LEN } from '../config.mjs';
import { createLink } from '../database/database.mjs';

const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateCode(length) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}


export function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}


export async function createUniqueLink(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode(LINK_LEN);
    try {
      await createLink(code, url);
      return code;
    } catch (err) {
      if (err.code !== 'SQLITE_CONSTRAINT') throw err;
    }
  }
  throw createError(500, 'Impossible de générer un code unique');
}


export function buildShortUrl(req, code) {
  return `${req.protocol}://${req.get('host')}${req.baseUrl}/${code}`;
}


export function toIsoDate(sqliteDate) {
  return new Date(`${sqliteDate.replace(' ', 'T')}Z`).toISOString();
}