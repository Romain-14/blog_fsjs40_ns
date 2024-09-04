import bcrypt from "bcrypt";

import Query from "../model/story.js";

// REGISTER

const register_view = (req, res) => {
	res.render("register");
};

const register = async (req, res) => {
	// si le nom et le mot de passe ont une longueur supérieure à 2 on procède à l'enregistrement
	if (req.body.username.length > 2 && req.body.password.length > 2) {
		// à faire en plus, vérifier que le nom d'utilisateur n'existe pas déjà !!!
		// ensuite on hash le mot de passe
		// méthode hash, prend en paramètre le mot de passe et le nombre de tours de la fonction de hachage (plus la valeur est élevée plus le hash est sécurisé et coûteux en ressources)
		const hash = await bcrypt.hash(req.body.password, 10);
		// préparation de la requête SQL
		const q = "INSERT INTO user (username, password) VALUES (?, ?)";
		// exécution de la requête SQL en envoyant le nom et le HASH du mot de passe
		await Query.runWithParams(q, [req.body.username, hash]);
		// redirection vers la page "login" pour améliorer l'experience utilisateur
		res.redirect("/authentication");
		return; // on sort de la fonction
	}
	// redirection vers la page "register" si les conditions ne sont pas remplies
	res.redirect("/register");
};

// LOGIN

const login_view = (req, res) => {
	res.render("login");
};

const login = async (req, res) => {
	// préparation de la requête SQL afin de vérifier si l'utilisateur existe
	const q = "SELECT username, password, role FROM `user` WHERE username = ?";
	// execution de la requête SQL
	const [[user]] = await pool.execute(q, [req.body.username]);
	// on récupère la donnée dans un tableau bi-dimensional --> destructuration double
	if (user) {
		// si l'utilisateur existe on va pouvoir vérifier le password
		// méthode compare de bcrypt pour comparer le password en clair(formulaire) avec le hash stocké en base de données
		const same = await bcrypt.compare(req.body.password, user.password);
		if (same) {
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
};

// LOGOUT

const logout = (req, res) => {
    // la méthode destroy de l'objet session détruit la session en cours
    // on passe une fonction de callback pour être sûr que la session est bien détruite
	req.session.destroy(() => {
		req.session = null; // 
		res.clearCookie("connect.sid");
		res.redirect("/");
	});
};

export { register_view, register, login_view, login, logout };
