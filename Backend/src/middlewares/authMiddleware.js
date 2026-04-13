const { verifyAccessToken } = require("../utils/jwt.js");
const Utilisateur = require("../models/utilisateur.js");

exports.protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer")) {
      return res.status(401).json({ message: "Non autorise" });
    }

    const token = auth.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Token invalide" });
    }

    const user = await Utilisateur.findById(decoded.id).select("-motDePasse");

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Compte desactive" });
    }

    req.user = user;
    next();
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
