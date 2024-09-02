import express from "express";

import pool from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
    const q = "SELECT * FROM story";
    pool.query(q)
        .then(([datas]) => {
            console.log(datas),
            res.render("home", {datas});

        })
});

export default router;