import { Router } from 'express';
import createError from 'http-errors';
import { countLinks, getLink, incrementVisit } from '../database/database.mjs';
import {
  buildShortUrl,
  createUniqueLink,
  isValidUrl,
  toIsoDate,
} from '../services/links.mjs';

const router = Router();

// GET / : nombre de liens déjà créés
router.get('/', async (req, res, next) => {
  try {
    res.json({ count: await countLinks() });
  } catch (err) {
    next(err);
  }
});

// POST / : crée un lien réduit
router.post('/', async (req, res, next) => {
  try {
    const url = req.body?.url;
    if (!isValidUrl(url)) {
      return next(createError(400, 'URL invalide'));
    }

    const code = await createUniqueLink(url);
    res.status(201).json({ short: buildShortUrl(req, code), origin: url });
  } catch (err) {
    next(err);
  }
});

router.get('/error', (req, res, next) => {
  next(createError(500, 'Erreur volontaire pour les tests'));
});

// GET /status/:url : état du lien. AVANT /:url, sinon "status" serait pris pour un code
router.get('/status/:url', async (req, res, next) => {
  try {
    const link = await getLink(req.params.url);
    if (!link) {
      return next(createError(404, 'Lien inconnu'));
    }
    res.json({
      origin: link.target_url,
      created_at: toIsoDate(link.created_at),
      visit: link.visit,
    });
  } catch (err) {
    next(err);
  }
});

// GET /:url : redirige vers l'URL d'origine et compte la visite
router.get('/:url', async (req, res, next) => {
  try {
    const link = await getLink(req.params.url);
    if (!link) {
      return next(createError(404, 'Lien inconnu'));
    }
    await incrementVisit(req.params.url);
    res.redirect(link.target_url);
  } catch (err) {
    next(err);
  }
});

export default router;