# TP6 - réducteur d’URL en Node.js/Express

## Installation
npm install

## Lancement
- développement : npm run dev
- production : npm run prod


## Partie 1 : prise en main
 fichiers REPONSES.md


## Partie 2 : compléter l'application
- Ajout des routes manquantes de l'API v1 : GET /api-v1/:url redirige vers l'URL d'origine,
et GET /api-v1/status/:url renvoie en JSON l'origine, la date de création et le nombre de visites du lien.
Un lien inconnu renvoie une erreur 404.
- Ajout du compteur de visites : l'attribut visit est incrémenté à chaque appel de GET /api-v1/:url.
- Ajout des fonctions d'accès à la base dans database/database.mjs  écrites avec async/await.
- Factorisation de la configuration dans config.mjs : lecture du .env`, variable NODE_ENV
et niveau de logging sont centralisés là, et les autres fichiers l'importent.

## Partie 3 : négociation de contenus et réponse HTML
- Ajout d'un nouveau routeur router/api-v2.mjs monté sur /api-v2, l'API v1 qui reste inchangée.
- Négociation de contenu avec res.format() : chaque route répond en JSON ou en HTML selon l'en-tête Accept de la requête, et renvoie une erreur 406 (Not Acceptable) pour tous les autres formats.
- GET / : nombre de liens en JSON, page d'accueil avec formulaire en HTML.
POST / : infos du lien créé en JSON, page avec le lien en HTML.
- GET /: url : infos du lien en JSON et en HTML incrémente le compteur de visites puis redirige.
- Pages HTML générées côté serveur avec EJS et lecture des formulaires.
- Logique commune aux deux versions de l'API factorisée dans services/links.mjs.