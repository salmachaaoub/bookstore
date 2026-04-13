const mongoose = require("mongoose");

const empruntSchema = new mongoose.Schema(
    {
        utilisateur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Utilisateur",
            required: [true, "L'utilisateur est obligatoire"],
        },

        livre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Livre",
            required: [true, "Le livre est obligatoire"],
        },

        dateEmprunt: {
            type: Date,
            default: Date.now,
        },

        dateRetourPrevue: {
            type: Date,
            required: [true, "La date de retour prévue est obligatoire"],
        },

        dateRetourReelle: {
            type: Date,
            default: null,
        },

        statut: {
            type: String,
            enum: {
                values: ["EN_COURS", "RETOURNE"],
                message: "Le statut doit être EN_COURS ou RETOURNE",
            },
            default: "EN_COURS",
        },
    },
    { timestamps: true }
);

empruntSchema.methods.toJSON = function () {
    const empruntObject = this.toObject();
    delete empruntObject.__v;
    return empruntObject;
};

module.exports = mongoose.model("Emprunt", empruntSchema);