import pool from "../config/db.js";

class User {
    static async add(data) {
        const q = "INSERT INTO user (username, password) VALUES (?, ?)";
        await pool.execute(q, data);
    }

    static async getOneByUsername(username) {
        const q = "SELECT username, password, role FROM `user` WHERE username = ?";
        const [[user]] = await pool.execute(q, username);
        return user;
    }
}

export default User;
