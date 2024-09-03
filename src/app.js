import "dotenv/config";
import express from "express";
import path from "path";
import session from "express-session";

import router from "./router/index.routes.js";

const app = express();
const PORT = process.env.LOCAL_PORT;

// configuration de moteur de template
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/view"));
// configuration de dossier statique
app.use("/css", express.static(path.join(process.cwd(), "public/css")));
app.use("/img", express.static(path.join(process.cwd(), "public/img")));


// dans un middleware d'express qui donc s'exécutera sur toutes les routes
// on va configurer express-session
// il a besoin d'un secret pour crypter les cookies
// celui ci ne doit pas changer ni être divulguer donc stockage dans le fichier .env
// resave et saveUninitialized sont des options pour éviter de stocker des données inutiles
// cookies :
// - secure :
    // - false pour le développement protocole http
    // - true pour le déploiement protocole https
// - httpOnly : true pour empêcher le client de lire le cookie (accès via JS)
// - sameSite :
    // - strict : le cookie n'est envoyé que si l'utilisateur navigue sur le domaine (notre app)
    // - lax : le cookie est envoyé si l'utilisateur navigue sur le domaine ou si c'est un lien externe
    // - none : le cookie est envoyé dans tous les cas
// - maxAge : durée de vie du cookie en millisecondes
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 259200000 }
}));

// FORMULAIRE
app.use(express.urlencoded({ extended: false }));

//  utilisation d'un middleware pour configurer la session personnalisée et envoyé des données dans les vues grâce à res.locals (objet express) évite de répéter du code dans la second paramètres des routes (méthode render).
// req.session est un objet qu'on va compléter lors de la connexion de l'utilisateur sur la route /login si c'est tout correspond (identifiant et password)
app.use((req, res, next) => {
    console.log(req.session);

    const username = req.session.isLogged ? req.session.user.username : "Guest";
    res.locals.username = username;
    res.locals.isLogged = req.session.isLogged;
    
    next();
});

// middleware pour le router
app.use(router);


app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));