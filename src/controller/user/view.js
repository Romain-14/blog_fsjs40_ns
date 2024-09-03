import pool from "../../config/db.js";

const home_view = (req, res) => {    

	const q = "SELECT * FROM story";
	pool.query(q).then(([datas]) => {
		res.render("home", { datas });
	});
};


const story_view = (req, res) => {
	const q = "SELECT * FROM story WHERE id = ?";
	pool.execute(q, [req.params.id])
		.then(([[data]]) => {
			res.render("story", { data });
		})
		.catch((error) => console.log(error));
};



export { home_view, story_view };