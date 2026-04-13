const mongoose = require("mongoose");

/**
 * Schéma de l'utilisateur
 * Représente les personnes qui utilisent le système :
 * administrateur, bibliothécaire ou membre.
 */
const utilisateurSchema = new mongoose.Schema(
    {
        // Nom complet de l'utilisateur
        nom: {
            type: String,
            required: [true, "Le nom est obligatoire"],
            trim: true,
            minlength: [2, "Le nom doit contenir au moins 2 caractères"],
            maxlength: [100, "Le nom ne doit pas dépasser 100 caractères"],
        },

        // Adresse email unique de l'utilisateur
        email: {
            type: String,
            required: [true, "L'email est obligatoire"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Veuillez saisir une adresse email valide",
            ],
        },

        // Mot de passe hashé de l'utilisateur
        motDePasse: {
            type: String,
            required: [true, "Le mot de passe est obligatoire"],
            minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
        },

        // Rôle de l'utilisateur dans le système
        role: {
            type: String,
            enum: {
                values: ["ADMIN", "BIBLIOTHECAIRE", "MEMBRE"],
                message: "Le rôle doit être ADMIN, BIBLIOTHECAIRE ou MEMBRE",
            },
            default: "MEMBRE",
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

/**
 * Transformation JSON :
 * on supprime certains champs sensibles ou inutiles
 * lors du retour des données au client.
 */
utilisateurSchema.methods.toJSON = function () {
    const utilisateurObject = this.toObject();

    delete utilisateurObject.motDePasse;
    delete utilisateurObject.__v;

    return utilisateurObject;
};

/**
 * Export du modèle Utilisateur
 */
module.exports = mongoose.model("Utilisateur", utilisateurSchema);