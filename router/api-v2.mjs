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

router.use((req, res, next) => {
  if (req.accepts(['json', 'html'])) {
    next();
  } else {
    next(createError(406, 'Not Acceptable : application/json ou text/html'));
  }
});

// GET / : JSON = nombre de liens, HTML = page d'accueil avec le formulaire
router.get('/', async (req, res, next) => {
  try {
    const count = await countLinks();
    res.format({
      json: () => res.json({ count }),
      html: () => res.render('root', { link: null, error: null }),
    });
  } catch (err) {
    next(err);
  }
});

// POST / : JSON = infos du lien créé, HTML = page avec le lien créé
router.post('/', async (req, res, next) => {
  try {
    const url = req.body?.url;

    if (!isValidUrl(url)) {
      return res.format({
        json: () => next(createError(400, 'URL invalide')),
        html: () =>
          res.status(400).render('root', { link: null, error: 'URL invalide' }),
      });
    }

    const code = await createUniqueLink(url);
    const link = { short: buildShortUrl(req, code), origin: url };

    res.format({
      json: () => res.status(201).json(link),
      html: () => res.status(201).render('root', { link, error: null }),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/error', (req, res, next) => {
  next(createError(500, 'Erreur volontaire pour les tests'));
});

// GET /:url : JSON = infos du lien (ancien /status/:url),
// HTML = incrémente le compteur de visites puis redirige.
// Il n'y a plus de route /status/:url dans la v2.
router.get('/:url', async (req, res, next) => {
  try {
    const code = req.params.url;
    const link = await getLink(code);
    if (!link) {
      return next(createError(404, 'Lien inconnu'));
    }

    res.format({
      json: () =>
        res.json({
          origin: link.target_url,
          created_at: toIsoDate(link.created_at),
          visit: link.visit,
        }),
      html: () => {
        // La fonction n'est pas async : on chaîne la promesse et on
        // transmet toute erreur à next, sinon elle serait perdue.
        incrementVisit(code)
          .then(() => res.redirect(link.target_url))
          .catch(next);
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;