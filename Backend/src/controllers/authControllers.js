const Utilisateur = require("../models/utilisateur.js");
const bcrypt = require("bcryptjs");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../utils/jwt.js");

// REGISTER
exports.register = async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        const exists = await Utilisateur.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Email déjà utilisé" });

        const hashed = await bcrypt.hash(motDePasse, 10);

        const user = await Utilisateur.create({
            nom,
            email,
            motDePasse: hashed,
        });

        res.status(201).json({
            message: "Utilisateur créé",
            data: {
                id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                accessToken: generateAccessToken(user._id, user.role),
                refreshToken: generateRefreshToken(user._id, user.role),
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        const user = await Utilisateur.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "Utilisateur introuvable" });

        if (!user.isActive)
            return res.status(403).json({ message: "Compte désactivé" });

        const match = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!match)
            return res.status(401).json({ message: "Mot de passe incorrect" });

        res.json({
            message: "Connexion réussie",
            data: {
                id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                accessToken: generateAccessToken(user._id, user.role),
                refreshToken: generateRefreshToken(user._id, user.role),
            },
        });
    } catch {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(400).json({ message: "Refresh token requis" });

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded)
        return res.status(401).json({ message: "Token invalide" });

    const newAccessToken = generateAccessToken(decoded.id, decoded.role);

    res.json({
        accessToken: newAccessToken,
    });
};
