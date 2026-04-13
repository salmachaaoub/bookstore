const express = require("express");
const router = express.Router();

const { authorizeRoles } = require("../middlewares/roleMiddleware.js");
const { protect } = require("../middlewares/authMiddleware.js");
const {
  getProfile,
  getAllUsers,
  changePassword,
  updateProfile,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserById,
} = require("../controllers/utilisateurController.js");

// utilisateur
router.get("/profile", protect, getProfile);
router.put("/profile/update", protect, updateProfile);
router.put("/profile/change-password", protect, changePassword);

// admin
router.get("/", protect, authorizeRoles("ADMIN"), getAllUsers);
router.get("/:id", protect, authorizeRoles("ADMIN"), getUserById);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateUser);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteUser);
router.patch("/:id/toggle", protect, authorizeRoles("ADMIN"), toggleUserStatus);

module.exports = router;

