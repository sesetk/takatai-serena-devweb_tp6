import { Router } from 'express';
import createError from 'http-errors';
import { randomInt } from 'crypto';
import { LINK_LEN } from '../config.mjs';
import { countLinks, createLink } from '../database/database.mjs';

const router = Router();

const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateCode(length) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

// GET / : nombre de liens déjà créés
router.get('/', async (req, res, next) => {
  try {
    const count = await countLinks();
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// POST / : crée un lien réduit
router.post('/', async (req, res, next) => {
  try {
    const url = req.body?.url;

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return next(createError(400, 'URL invalide'));
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return next(createError(400, 'URL invalide'));
    }

    const code = generateCode(LINK_LEN);
    await createLink(code, url);

    res.status(201).json({
      short: `${req.protocol}://${req.get('host')}/${code}`,
      origin: url,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/error', (req, res, next) => {
  next(createError(500, 'Erreur volontaire pour les tests'));
});

// /status/:url AVANT /:url
router.get('/status/:url', (req, res, next) => {
  next(createError(501, 'Not Implemented'));
});

router.get('/:url', (req, res, next) => {
  next(createError(501, 'Not Implemented'));
});

export default router;