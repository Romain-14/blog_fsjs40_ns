
// import de formidable pour gérer les données du formulaire en mode multipart/form-data
import formidable from "formidable";
// on va former un chemin absolu pour le déplacement du fichier, utilisation de path (module de node)
import path from "path";
// on va déplacer le fichier de l'emplacement temporaire vers le dossier public/img, utilisation de fs (module de node)
import fs from "fs";

import pool from "../../config/db.js";

const create_story = (req, res) => {
    // on stocke dans une constante le formulaire formidable
    const form = formidable();

    // on parse le formulaire
    // la méthode parse prend 3 arguments :
    // - la requête
    // - une fonction de callback qui prend 3 arguments :
    //     - une erreur
    //     - les champs du formulaire
    //     - les fichiers du formulaire
    // on code dans la CB
	form.parse(req, (err, fields, files) => {
        // traitement des erreurs
        if (err) {
            // 500 erreur serveur
            res.status(500).send(err);
            return;
        }
        // si pas d'image envoyée
        if (!files.img || !files.img.length) {
            res.status(400).send('No image uploaded');
            return;
        }
        
        // on forme les chemins pour le déplacement du fichier
        // img ici est la valeur de l'attribut name du champ input de type file
        // formidable met les données dans un tableau au nom du champ d'où le [0]
        // on récupère le chemin temporaire du fichier
        const oldPath = files.img[0].filepath;
        // on forme le chemin de destination
        const newPath = path.join(process.cwd(), 'public', 'img', files.img[0].originalFilename);
        // on déplace le fichier de l'ancien emplacement vers le nouveau
        // la méthode copyFile prend 3 arguments :
        // - l'ancien chemin
        // - le nouveau chemin
        // - une fonction de callback qui prend 1 argument :
        //     - une erreur
		fs.copyFile(oldPath, newPath, (err) => {
            // traitement des erreurs
            // si erreur on stop tout
            if (err) {
                res.status(500).send(err);
                return;
            }
			const q = `
                INSERT INTO story (title, content, publishDate, img, category_id) 
                VALUES (?, ?, NOW(), ?, ?)
            `; 

            // on exécute la requête en utilisant la méthode execute de l'objet pool
            // on passe par formidable ayant une image dans le formulaire donc on utilise 'fields' qui contient les champs du formulaire
            // formidable met également les données dans un tableau d'où le [0]
			pool.execute(q, [
                fields.title[0],
                fields.content[0],
                files.img[0].originalFilename,
                fields.category_id[0],
            ])
                .then(() => {
                    // si c'est bon on redirige vers la page d'admin
                    res.redirect("/admin/story");
                })
                .catch((error) => {
                    // si erreur on stop tout
                    res.status(500).send('Database error');
                    return;
                });
		});
	});
};

export { create_story };
