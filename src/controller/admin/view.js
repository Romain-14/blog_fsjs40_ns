import pool from "../../config/db.js";

const admin_view = async (req, res) => {
	try {
		const [[users]] = await pool.query(
			"SELECT COUNT(*) AS count FROM user"
		);
		const [[stories]] = await pool.query(
			"SELECT COUNT(*) AS count FROM story"
		);
		const [[comments]] = await pool.query(
			"SELECT COUNT(*) AS count FROM comment"
		);
		const [[categories]] = await pool.query(
			"SELECT COUNT(*) AS count FROM category"
		);

		res.render("admin/layout", { template: "home",
			users: users.count,
			stories: stories.count,
			comments: comments.count,
			categories: categories.count,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const story_list_view = (req, res) => {
	const q = "SELECT * FROM story";
	pool.query(q).then(([stories]) => {
		res.render("admin/layout", { template: "story/list", stories });
	});
};

const create_story_view = (req, res) => {
	const q = "SELECT * FROM category";
	pool.query(q).then(([categories]) => {
		res.render("admin/layout", { template: "story/create", categories });
	});
};
const update_story_view = async (req, res) => {
	try {
		const q1 = `SELECT story.id, category.id AS idCategory, title, label, content, img, category_id FROM story JOIN category ON story.category_id = category.id WHERE story.id = ?`;
		const [[story]] = await pool.execute(q1, [req.params.id]);
		console.log(story);
		const q2 = "SELECT * FROM category";
		const [categories] = await pool.query(q2);

		res.render("admin/layout", { template: "story/update", story, categories });
	} catch (error) {
		console.log(error);
	}
};

export { admin_view, story_list_view, create_story_view, update_story_view };
