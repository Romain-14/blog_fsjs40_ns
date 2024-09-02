import express from "express";

import pool from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
    const q = "SELECT * FROM story";
    pool.query(q)
        .then(([datas]) => {
            res.render("home", {datas});
        })
});

router.get("/story/:id", (req, res) => {
    // les paramètres dynamiques sont identifiés dans la route par les ":"
    // on peut les récupérer dans la requête avec req.params
    console.log(req.params); 
    // il faut protéger la requête contre les injections SQL
    // en utilisant la méthode execute() de l'objet pool
    // on place un placeholder "?" dans la requête
    // on place la/les valeur(s) à injecter dans un tableau en 2e argument de la méthode execute()
    const q = "SELECT * FROM story WHERE id = ?";
    pool.execute(q, [req.params.id])
        .then(( [[data]] ) => {
            // destructure de 2 niveaux car la méthode execute() renvoie un tableau de tableau et on a besoin que d'une donnée
            res.render("story", {data});
        })
        .catch(error => console.log(error));
});

export default router;