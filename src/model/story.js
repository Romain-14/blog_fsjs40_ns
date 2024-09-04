import pool from "../config/db.js";

// création de la classe Story pour gérer les requêtes SQL liées aux stories
// on utilise une classe pour pouvoir créer des méthodes statiques
// qui seront directement accessibles sans avoir à instancier la classe
// on n'a pas besoin d'instancier la classe pour utiliser ses méthodes
// utiliser des noms de méthodes explicites pour faciliter la lecture du code
// on y déplace les requêtes SQL pour les isoler du reste du code et les réutiliser facilement
// on utilise async/await pour rendre les requêtes asynchrones

class Story {
    static async getAll() {
        const q = "SELECT * FROM story";
        const [datas] = await pool.query(q);
        return datas;
    }

    static async getOneById(id) {
        const q = "SELECT * FROM story WHERE id = ?";
        const [[data]] = await pool.execute(q, [id] );
        return data;
    }

}

export default Story;