# TP6 - réducteur d’URL en Node.js/Express

## Installation
npm install

## Lancement
- développement : npm run dev
- production : npm run prod


## Partie 1 : prise en main
 fichiers REPONSES.md


## Partie 2 : compléter l'application
Ajout des routes manquantes de l'API v1 : GET /api-v1/:url redirige vers l'URL d'origine,
et GET /api-v1/status/:url renvoie en JSON l'origine, la date de création et le nombre de visites du lien.
Un lien inconnu renvoie une erreur 404.
- Ajout du compteur de visites : l'attribut visit est incrémenté à chaque appel de GET /api-v1/:url.
- Ajout des fonctions d'accès à la base dans database/database.mjs  écrites avec async/await.
- Factorisation de la configuration dans config.mjs : lecture du .env`, variable NODE_ENV
et niveau de logging sont centralisés là, et les autres fichiers l'importent.

