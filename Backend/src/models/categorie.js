const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, "Le nom est obligatoire"],
            trim: true,
            minlength: [2, "Le nom doit contenir au moins 2 caractères"],
            maxlength: [100, "Le nom ne doit pas dépasser 100 caractères"],
            unique: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "La description ne doit pas dépasser 500 caractères"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Clean JSON
categorieSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model("Categorie", categorieSchema);