import pool from "../config/db.js";

const home = (req, res) => {
	const q = "SELECT * FROM story";
	pool.query(q).then(([datas]) => {
		res.render("home", { datas });
	});
};

export { home };
