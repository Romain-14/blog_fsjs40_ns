import express from "express";

import { home_view, story_view } from "../controller/user/view.js";
import admin_router from "./admin.routes.js";

const router = express.Router();

// USER -> controller
router.get("/", home_view);
router.get("/story/:id", story_view);


router.use("/admin", admin_router);

// créer le middleware pour la route d'authentification et importer son router (fichier auth.routes.js)
// ...

export default router;

