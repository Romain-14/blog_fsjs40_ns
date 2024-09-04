import pool from "../../config/db.js";

const update_story = async (req, res) => {
    const q = "UPDATE story SET title = ?, content = ?, category_id = ? WHERE id = ?";
    await pool.execute(q, [req.body.title, req.body.content, req.body.category_id, req.params.id]);
    res.redirect("/admin/story");
}


export { update_story };