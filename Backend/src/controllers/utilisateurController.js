const Utilisateur = require("../models/utilisateur.js");
const bcrypt = require("bcryptjs");


// Récupération du profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    res.status(200).json({
      message: "Profil récupéré avec succès",
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la récupération du profil",
      error: error.message,
    });
  }
};

// Mise à jour du profil de l'utilisateur connecté
exports.updateProfile = async (req, res) => {
  try {
    const { nom, email } = req.body;

    const user = await Utilisateur.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    // Vérification email unique
    if (email && email !== user.email) {
      const exists = await Utilisateur.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email déjà utilisé" });

      user.email = email;
    }

    if (nom) user.nom = nom;

    await user.save();

    res.json({
      message: "Informations mises à jour",
      data: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Changement de mot de passe pour l'utilisateur connecté
exports.changePassword = async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    const user = await Utilisateur.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    // Vérifier ancien mot de passe
    const isMatch = await bcrypt.compare(
      ancienMotDePasse,
      user.motDePasse
    );

    if (!isMatch)
      return res.status(400).json({
        message: "Ancien mot de passe incorrect",
      });

    // Vérifier longueur nouveau mot de passe
    if (nouveauMotDePasse.length < 6)
      return res.status(400).json({
        message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });

    const hashed = await bcrypt.hash(nouveauMotDePasse, 10);

    user.motDePasse = hashed;

    await user.save();

    res.json({
      message: "Mot de passe modifié avec succès",
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Regarder les utilisateurs (admin uniquement)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Utilisateur.find().select("-motDePasse");

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Aucun utilisateur trouvé",
      });
    }

    res.status(200).json({
      message: "Liste des utilisateurs récupérée avec succès",
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des utilisateurs",
      error: error.message,
    });
  }
};
/// Récupérer un utilisateur par ID (admin uniquement)
exports.getUserById = async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id).select("-motDePasse");

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json(user);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// update un utilisateur (admin uniquement)
exports.updateUser = async (req, res) => {
  try {
    const { nom, email, role } = req.body;

    const user = await Utilisateur.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    // Email unique
    if (email && email !== user.email) {
      const exists = await Utilisateur.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email déjà utilisé" });

      user.email = email;
    }

    if (nom) user.nom = nom;

    if (role) user.role = role;

    await user.save();

    res.json({
      message: "Utilisateur mis à jour",
      data: user,
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Supprimer un utilisateur (admin uniquement)
exports.deleteUser = async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    await user.deleteOne();

    res.json({ message: "Utilisateur supprimé" });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Basculer le statut d'un utilisateur (admin uniquement)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    user.isActive = !user.isActive;

    await user.save();

    res.json({
      message: user.isActive ? "Utilisateur activé" : "Utilisateur désactivé",
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
