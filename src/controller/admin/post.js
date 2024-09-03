import pool from "../../config/db.js";

const create_story = (req, res) => {
	const q = `
        INSERT INTO story (title, content, publishDate, img, category_id) 
        VALUES (?, ?, NOW(), ?, ?)
    `;
	pool.execute(q, [
		req.body.title,
		req.body.content,
		req.body.img,
		req.body.category_id,
	])
		.then(() => {
			res.redirect("/admin/story");
		})
		.catch((error) => console.log(error));
};

export { create_story };