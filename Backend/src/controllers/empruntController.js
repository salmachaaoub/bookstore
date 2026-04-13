const Emprunt = require("../models/emprunt.js");
const Livre = require("../models/livre.js");

//  Emprunter un livre
exports.createEmprunt = async (req, res) => {
    try {
        const { livreId, dateRetourPrevue } = req.body;

        if (!dateRetourPrevue) {
            return res.status(400).json({
                message: "La date de retour prévue est obligatoire",
            });
        }

        const livre = await Livre.findById(livreId);

        if (!livre) {
            return res.status(404).json({
                message: "Livre introuvable",
            });
        }

        if (!livre.isActive) {
            return res.status(400).json({
                message: "Ce livre est désactivé",
            });
        }

        if (livre.exemplairesDisponibles <= 0) {
            return res.status(400).json({
                message: "Aucun exemplaire disponible",
            });
        }

        // stock
        livre.exemplairesDisponibles -= 1;
        await livre.save();

        const emprunt = await Emprunt.create({
            utilisateur: req.user._id,
            livre: livreId,
            dateRetourPrevue,
        });

        res.status(201).json({
            message: "Livre emprunté avec succès",
            data: emprunt,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur lors de l'emprunt",
            error: error.message,
        });
    }
};

// Retourner livre
exports.returnLivre = async (req, res) => {
    try {
        const emprunt = await Emprunt.findById(req.params.id);

        if (!emprunt) {
            return res.status(404).json({
                message: "Emprunt introuvable",
            });
        }

        if (emprunt.statut === "RETOURNE") {
            return res.status(400).json({
                message: "Ce livre est déjà retourné",
            });
        }

        const livre = await Livre.findById(emprunt.livre);

        if (!livre) {
            return res.status(404).json({
                message: "Livre introuvable",
            });
        }

        // stock
        livre.exemplairesDisponibles += 1;
        await livre.save();

        emprunt.statut = "RETOURNE";
        emprunt.dateRetourReelle = new Date();

        await emprunt.save();

        res.status(200).json({
            message: "Livre retourné avec succès",
            data: emprunt,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur lors du retour",
            error: error.message,
        });
    }
};

//  Mes emprunts (user)
exports.getMesEmprunts = async (req, res) => {
    try {
        const emprunts = await Emprunt.find({
            utilisateur: req.user._id,
        }).populate("livre");

        res.status(200).json({
            count: emprunts.length,
            data: emprunts,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message,
        });
    }
};

//  Tous les emprunts (admin)
exports.getAllEmprunts = async (req, res) => {
    try {
        const emprunts = await Emprunt.find()
            .populate("livre")
            .populate("utilisateur");

        res.status(200).json({
            count: emprunts.length,
            data: emprunts,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message,
        });
    }
};

//  Get by ID
exports.getEmpruntById = async (req, res) => {
    try {
        const emprunt = await Emprunt.findById(req.params.id)
            .populate("livre")
            .populate("utilisateur");

        if (!emprunt) {
            return res.status(404).json({
                message: "Emprunt introuvable",
            });
        }

        res.status(200).json(emprunt);
    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message,
        });
    }
};
