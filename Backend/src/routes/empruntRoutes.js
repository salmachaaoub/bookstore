const express = require("express");
const router = express.Router();

const {
  createEmprunt,
  returnLivre,
  getMesEmprunts,
  getAllEmprunts,
  getEmpruntById,
} = require("../controllers/empruntController");

const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// MEMBRE
router.post("/", protect, createEmprunt);
router.get("/me", protect, getMesEmprunts);

// ADMIN + BIBLIOTHECAIRE
router.get("/", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), getAllEmprunts);
router.get("/:id", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), getEmpruntById);
router.patch("/:id/retour", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), returnLivre);

module.exports = router;

