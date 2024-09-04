import pool from "../../config/db.js";

import Story from "../../model/Story.js";

// AVANT MODEL
// const home_view = (req, res) => {
// 	const q = "SELECT * FROM story";
// 	pool.query(q)
//         .then(([datas]) => {
//             res.render("user/layout", { template: "home", datas });
//         });
// };

// APRES MODEL
// on passe en async pour pouvoir utiliser await
const home_view = async (req, res) => {
	// on utilise la méthode getAll du model Story
    // pas d'instance à créer, on appelle directement la méthode statique de la classe
    const datas = await Story.getAll();
	res.render("user/layout", { template: "home", datas });
};

const story_view = async (req, res) => {
    const data = await Story.getOneById(req.params.id);
    res.render("user/layout", { template: "story", data });
	
};

export { home_view, story_view };
