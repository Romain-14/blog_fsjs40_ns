import bcrypt from "bcrypt";

import User from "../model/user.js";

// REGISTER

const register_view = (req, res) => {
	res.render("user/layout", { template: "register" });
};

const register = async (req, res) => {
	// si le nom et le mot de passe ont une longueur supérieure à 2 on procède à l'enregistrement
	if (req.body.username.length > 2 && req.body.password.length > 2) {
		// à faire en plus, vérifier que le nom d'utilisateur n'existe pas déjà !!!
		// ensuite on hash le mot de passe
		// méthode hash, prend en paramètre le mot de passe et le nombre de tours de la fonction de hachage (plus la valeur est élevée plus le hash est sécurisé et coûteux en ressources)
		const hash = await bcrypt.hash(req.body.password, 10);
		// on ajoute le nouvel utilisateur en base de données
		await User.add([req.body.username, hash]);
		// redirection vers la page "login" pour améliorer l'experience utilisateur
		res.redirect("/authentication");
		return; // on sort de la fonction
	}
	// redirection vers la page "register" si les conditions ne sont pas remplies
	res.redirect("/register");
};

// LOGIN

const login_view = (req, res) => {
	res.render("user/layout", { template: "login" });
};

const login = async (req, res) => {
	// préparation de la requête SQL afin de vérifier si l'utilisateur existe
    const user = await User.getOneByUsername([req.body.username]);
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
