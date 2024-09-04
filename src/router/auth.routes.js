import express from "express";

import {
	register,
	login,
	login_view,
	register_view,
	logout,
} from "../controller/auth.js";

const router = express.Router();

// AUTHENTICATION -> controller

// REGISTER
// route d''ajout d'un user
// utilisation d'async/await pour gérer les promesses
// on passe la fonction en async pour pouvoir utiliser await
// facilite la lecture du code
// await aura un comportement synchrone, on stocke le résultat de la promesse dans une variable
router.get("/register", register_view);
router.post("/register", register);

// LOGIN
router.get("/", login_view);
router.post("/login", login);

router.get("/logout", logout);

export default router;
