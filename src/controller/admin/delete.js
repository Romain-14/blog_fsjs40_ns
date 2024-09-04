import pool from "../../config/db.js";

const delete_story = async (req, res) => {
    const q = "DELETE FROM story WHERE id = ?";
    await pool.execute(q, [req.params.id]);
    res.redirect("/admin/story");
}

export { delete_story };