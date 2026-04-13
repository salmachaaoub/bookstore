const express = require("express");
const router = express.Router();

const {
  createCategorie,
  getAllCategories,
  getCategorieById,
  updateCategorie,
  deleteCategorie,
  toggleCategorie,
} = require("../controllers/categorieController");

const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// accessible à tous les users connectés
router.get("/", protect, getAllCategories);
router.get("/:id", protect, getCategorieById);

// ADMIN + BIBLIOTHECAIRE
router.post("/", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), createCategorie);
router.put("/:id", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), updateCategorie);
router.delete("/:id", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), deleteCategorie);
router.patch("/:id/toggle", protect, authorizeRoles("ADMIN", "BIBLIOTHECAIRE"), toggleCategorie);

module.exports = router;

