import pool from "../../config/db.js";

const admin_view =  (req, res) => {
	res.render("admin/index");
};

const story_list_view = (req, res) => {
	const q = "SELECT * FROM story";
	pool.query(q).then(([stories]) => {
		res.render("admin/story/list", { stories });
	});
}

const create_story_view =(req, res) => {
	const q = "SELECT * FROM category";
	pool.query(q).then(([categories]) => {
		res.render("admin/story/create", { categories });
	});
}

export {admin_view, story_list_view, create_story_view};