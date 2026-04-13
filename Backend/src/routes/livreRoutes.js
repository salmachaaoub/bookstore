const express = require("express");
const router = express.Router();

const {
  createLivre,
  getLivres,
  getLivresVisiteur,
  getLivreById,
  updateLivre,
  deleteLivre,
  toggleLivre,
} = require("../controllers/livreController.js");

const { protect } = require("../middlewares/authMiddleware.js");
const { authorizeRoles } = require("../middlewares/roleMiddleware.js");

// PUBLIC (visiteur)
router.get("/public", getLivresVisiteur);

// GET
router.get("/", protect, getLivres);
router.get("/:id", protect, getLivreById);

// ADMIN + BIBLIOTHECAIRE
router.post("/", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), createLivre);
router.put("/:id", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), updateLivre);
router.delete("/:id", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), deleteLivre);
router.patch("/:id/toggle", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), toggleLivre);

module.exports = router;

