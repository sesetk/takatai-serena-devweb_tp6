import { Router } from "express";
import createError from "http-errors";
import { randomInt } from "crypto";
import { LINK_LEN } from "../config.mjs";
import {
  countLinks,
  createLink,
  getLink,
  incrementVisit,
} from "../database/database.mjs";

const router = Router();

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateCode(length) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

// Le code est UNIQUE en base : en cas (rare) de collision, on retente avec un autre code
async function createUniqueLink(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode(LINK_LEN);
    try {
      await createLink(code, url);
      return code;
    } catch (err) {
      if (err.code !== "SQLITE_CONSTRAINT") throw err;
    }
  }
  throw createError(500, "Impossible de générer un code unique");
}

// GET / : nombre de liens déjà créés
router.get("/", async (req, res, next) => {
  try {
    res.json({ count: await countLinks() });
  } catch (err) {
    next(err);
  }
});

// POST / : crée un lien réduit
router.post("/", async (req, res, next) => {
  try {
    const url = req.body?.url;

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return next(createError(400, "URL invalide"));
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return next(createError(400, "URL invalide"));
    }

    const code = await createUniqueLink(url);

    res.status(201).json({
      short: `${req.protocol}://${req.get("host")}/${code}`,
      origin: url,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/error", (req, res, next) => {
  next(createError(500, "Erreur volontaire pour les tests"));
});

// GET /status/:url : état du lien (JSON). AVANT /:url, sinon "status" serait pris pour un code
router.get("/status/:url", async (req, res, next) => {
  try {
    const link = await getLink(req.params.url);
    if (!link) {
      return next(createError(404, "Lien inconnu"));
    }
    res.json({
      origin: link.target_url,
      created_at: new Date(
        `${link.created_at.replace(" ", "T")}Z`,
      ).toISOString(),
      visit: link.visit,
    });
  } catch (err) {
    next(err);
  }
});

// GET /:url : redirige vers l'URL d'origine et compte la visite
router.get("/:url", async (req, res, next) => {
  try {
    const link = await getLink(req.params.url);
    if (!link) {
      return next(createError(404, "Lien inconnu"));
    }
    await incrementVisit(req.params.url);
    res.redirect(link.target_url);
  } catch (err) {
    next(err);
  }
});

export default router;
