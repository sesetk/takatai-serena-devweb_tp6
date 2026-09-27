import { Router } from 'express';
import createError from 'http-errors';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API v1 - GET OK' });
});

router.post('/', (req, res) => {
  res.json({ message: 'API v1 - POST OK', body: req.body });
});

router.get('/error', (req, res, next) => {
  next(createError(500, 'Erreur volontaire pour les tests'));
});

// /status/:url AVANT /:url, sinon "status" est capturé comme :url
router.get('/status/:url', (req, res, next) => {
  next(createError(501, 'Not Implemented'));
});

router.get('/:url', (req, res, next) => {
  next(createError(501, 'Not Implemented'));
});

export default router;