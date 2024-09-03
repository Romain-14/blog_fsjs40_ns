import express from "express";
import bcrypt from "bcrypt"; // <--- module de hachage de mot de passe

import pool from "../config/db.js";

import { home_view, story_view } from "../controller/user/view.js";
import { admin_view, create_story_view, story_list_view } from "../controller/admin/view.js";
import { create_story } from "../controller/admin/post.js";

const router = express.Router();

// USER -> controller
router.get("/", home_view);
router.get("/story/:id", story_view);

// ADMIN -> controller
// views
router.get("/admin", admin_view);
router.get("/admin/story", story_list_view);
router.get("/admin/story/create", create_story_view);

// posts 
router.post("/admin/story/create", create_story);

// AUTHENTICATION -> controller

// REGISTER
router.get("/register" , (req, res) => {
    res.render("register");
});
// route d''ajout d'un user
// utilisation d'async/await pour gérer les prommesses
// on passe la fonction en async pour pouvoir utiliser await
// facilite la lecture du code
// await aura un comportement synchrone, on stocke le résultat de la promesse dans une variable

router.post("/register", async (req, res) => {
    // si le nom et le mot de passe ont une longueur supérieure à 2 on procède à l'enregistrement
    if(req.body.username.length > 2 && req.body.password.length > 2){
        // à faire en plus, vérifier que le nom d'utilisateur n'existe pas déjà !!!
        // ensuite on hash le mot de passe
        // méthode hash, prend en paramètre le mot de passe et le nombre de tours de la fonction de hachage (plus la valeur est élevée plus le hash est sécurisé et coûteux en ressources)
        const hash = await bcrypt.hash(req.body.password, 10);
        // préparation de la requête SQL
        const q = "INSERT INTO user (username, password) VALUES (?, ?)";
        // exécution de la requête SQL en envoyant le nom et le HASH du mot de passe
        await pool.execute(q, [req.body.username, hash]);
        // redirection vers la page "login" pour améliorer l'experience utilisateur
        res.redirect("/authentication");
        return; // on sort de la fonction
    }
    // redirection vers la page "register" si les conditions ne sont pas remplies
    res.redirect("/register")

})

// LOGIN
router.get("/authentication", (req, res)=>{
    res.render("login");
});

router.post("/login", async (req, res ) => {
    // préparation de la requête SQL afin de vérifier si l'utilisateur existe
    const q = "SELECT username, password, role FROM `user` WHERE username = ?";
    // execution de la requête SQL
    const [[user]] = await pool.execute(q, [req.body.username]);
    // on récupère la don:ée dans un tableau bi-dimensional --> destructuration double
    if(user){
        // si l'utilisateur existe on va pouvoir vérifier le password
        // méthode compare de bcrypt pour comparer le password en clair(formulaire) avec le hash stocké en base de données
        const same = await bcrypt.compare(req.body.password, user.password);
        if(same){
            // si les password correspondent on créé une session utilisateur dans l'objet de session
            req.session.user = req.body;
            req.session.isLogged = true;
            // et on redirige vers la page d'accueil
            res.redirect("/");
            return; // on sort de la fonction
        }
    }
    // si aucun utilisateur n'est trouvé ou si les mots de passe ne correspondent pas
    // on redirige vers le formulaire de login pour qu'il retente sa chance
    console.log("MAUVAIS IDENTIFIANT(S) NOUVEL ESSAI"); // juste pour nous dans le terminal !!
    res.redirect("/authentication");
});

export default router;