const express = require("express");
const router = express.Router();

// Import des routes
const authRoutes = require("./authRoutes.js");
const utilisateurRoutes = require("./utilisateurRoutes.js");
const categorieRoutes = require("./categorieRoutes.js");
const livreRoutes = require("./livreRoutes.js");
const empruntRoutes = require("./empruntRoutes.js");

router.use("/auth", authRoutes);
router.use("/utilisateurs", utilisateurRoutes);
router.use("/categories", categorieRoutes);
router.use("/livres", livreRoutes);
router.use("/emprunts", empruntRoutes);

// Centralisation
module.exports = router;

