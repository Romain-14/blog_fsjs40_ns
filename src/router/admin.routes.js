import express from "express";

import {
	admin_view,
	create_story_view,
	story_list_view,
	update_story_view,
} from "../controller/admin/view.js";
import { create_story } from "../controller/admin/post.js";
import { update_story } from "../controller/admin/update.js";
import { delete_story } from "../controller/admin/delete.js";

const router = express.Router();

// quand on arrive dans ce fichier on est sur l'adresse url :
// http://localhost:9000/admin

// ADMIN -> controller
// views
router.get("/", admin_view); // le "/" correspond à la racine de l'adresse http://localhost:9000/admin
router.get("/story", story_list_view); // http://localhost:9000/admin/story
router.get("/story/create", create_story_view); // http://localhost:9000/admin/story/create
router.get("/story/update/:id", update_story_view); // http://localhost:9000/admin/story/update/48

// posts
router.post("/story/create", create_story);

// UPDATE STORY
router.post("/story/update/:id", update_story);

router.get("/story/delete/:id", delete_story);


export default router;