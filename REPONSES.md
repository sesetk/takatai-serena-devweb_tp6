# TP6 Partie 1



## Donner la commande httpie correspondant à la commande curl donnée par la doc pour la route POST

http POST http://localhost:8080/api-v1/ url="https://perdu.com"

## Démarrer l’application en mode production avec npm run prod puis en mode développement avec npm run dev. Donner les principales différences entre les deux modes.

    - npm run dev : utilise nodemon, qui surveille les fichiers du projet et redémarre automatiquement le serveur à chaque sauvegarde. C'est le mode utilisé pendant le développement pour ne pas avoir à relancer le serveur manuellement.
    - npm run prod : lance le serveur directement avec node, sans surveillance ni redémarrage automatique : si on modifie un fichier, il faut arrêter et relancer la commande soi-même.
Les deux ont une variable d'environnement NODE_ENV différente (development pour dev, production pour prod), ce qui change le niveau de logs et le niveau de détail des erreurs renvoyées par le middleware de gestion d'erreurs.

## Donner le script npm qui permet de formatter automatiquement tous les fichiers .mjs

--> dans la partie script du fichier package.json
"format": "prettier --write \"**/*.mjs\""  

--> terminal
>> npm run format

## Les réponses HTTP contiennent une en-tête X-Powered-By. Donner la configuration Express à modifier pour qu’elle n’apparaisse plus.

--> dans le fichier server.mjs
app.disable('x-powered-by');

## Créer un nouveau middleware (niveau application) qui ajoute un header X-API-version avec la version de l’application. Donner le code.


--> dans le fichier server.mjs
app.use((req, res, next) => {
  res.set('X-API-version', '1.0.0');
  next();
});  

## Trouver un middleware Express qui permet de répondre aux requêtes favicon.ico avec static/logo_univ_16.png. Donner le code.

>>  npm install serve-favicon      

--> server.mjs
import favicon from 'serve-favicon';
import path from 'path';

app.use(favicon(path.join(process.cwd(), 'static', 'logo_univ_16.png')));

>> npm run dev

## Donner les liens vers la documentation du driver SQLite utilisé dans l’application.

https://github.com/TryGhost/node-sqlite3/wiki/API
https://www.npmjs.com/package/sqlite3

## Indiquer à quels moments la connexion à la base de données est ouverte est quand elle est fermée.

La connexion s'ouvre dès que "new sqlite3.Database(...)". Elle n'est jamais vraiment fermée, elle reste ouverte tant que le processus Node tourne.

## Avec un navigateur en mode privé visiter une première fois http://localhost:8080/api-v1/, puis une deuxième. Ensuite rechargez avec Ctrl+Shift+R. Conclure sur la gestion du cache par Express.

À la première visite, le serveur répond 200 avec le contenu complet. À la deuxième, le navigateur renvoie l'ETag dans If-None-Match et Express répond 304 Not Modified sans corps si le contenu n'a pas changé : le cache est géré par validation. Quand on recharge la page le navigateur ne renvoie pas If-None-Match et force une réponse complète 200, ce qui contourne le cache.

## Ouvrir deux instances de l’application, une sur le port 8080 avec npm run dev et une autre sur le port 8081 avec la commande cross-env PORT=8081 NODE_ENV=development npx nodemon server.mjs. Créer un lien sur la première instance http://localhost:8080/ et ensuite un autre sur la seconde instante http://localhost:8081/. Les liens de l’un doivent être visibles avec l’autre. Expliquer pourquoi.


Instance 1 : npm run de (port 8080).
Instance 2 : cross-env PORT=8081 NODE_ENV=development npx nodemon server.mjs (port 8081).

Un lien créé via l'instance sur le port 8080 est enregistré
par GET /api-v1/ sur le port 8081, et pareil pour le lien via l'instance du port 8081, le compteur passe de 0
à 1 puis à 2.
Les deux instances sont deux processus Node indépendants, mais
elles utilisent le même fichier de base de données SQLite. Les liens ne
sont pas stockés en mémoire dans chaque processus mais dans ce fichier
partagé sur le disque, donc les deux instances lisent et écrivent les mêmes données.