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

## Partie 4 : client AJAX de l’API v2
- Ajout d'un client de type Single Page Application, servi par Express : static/client.html et static/app.js.
- Le formulaire envoie POST /api-v2/ avec fetch en JSON, sans recharger la page.
- Le lien raccourci ou le message d'erreur (URL invalide, serveur injoignable) est affiché dynamiquement, et un bouton « Copier l'URL » copie le lien.
- La première ligne de static/app.js permet de servir la page depuis un autre serveur.

## Partie 5 : gestion de la suppression des liens
- Ajout d'une colonne secret en base : un secret aléatoire est créé avec chaque lien et renvoyé une seule fois, dans la réponse JSON de POST /api-v2/. Il n'est jamais renvoyé par GET /api-v2/:url.
- Nouvelle route DELETE /api-v2/:url, protégée par l'en-tête X-API-Key : 404 si le lien n'existe pas, 401 si l'en-tête est absent, 403 si le secret est incorrect, 200 et suppression en base sinon.
- Documentation OpenAPI complétée dans static/open-api.yaml affichée avec Swagger UI sur /api-docs.