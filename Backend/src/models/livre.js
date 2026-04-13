const mongoose = require("mongoose");

const livreSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      minlength: [2, "Le titre doit contenir au moins 2 caractères"],
    },

    auteur: {
      type: String,
      required: [true, "L'auteur est obligatoire"],
      trim: true,
    },

    isbn: {
      type: String,
      required: [true, "ISBN obligatoire"],
      unique: true,
      trim: true,
    },

    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
      required: true,
    },

    quantite: {
      type: Number,
      required: true,
      min: [0, "Quantité invalide"],
    },

    exemplairesDisponibles: {
      type: Number,
      required: true,
      min: [0, "Stock invalide"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

livreSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Livre", livreSchema);