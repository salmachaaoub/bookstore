const Categorie = require("../models/categorie.js");

// CREATE
exports.createCategorie = async (req, res) => {
  try {
    const { nom, description } = req.body;

    const exists = await Categorie.findOne({ nom });
    if (exists)
      return res.status(400).json({ message: "Catégorie déjà existante" });

    const categorie = await Categorie.create({ nom, description });

    res.status(201).json({
      message: "Catégorie créée",
      data: categorie,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET ALL
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.find();

    res.status(200).json({
      count: categories.length,
      data: categories,
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET BY ID
exports.getCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);

    if (!categorie)
      return res.status(404).json({ message: "Catégorie introuvable" });

    res.json(categorie);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// UPDATE
exports.updateCategorie = async (req, res) => {
  try {
    const { nom, description } = req.body;

    const categorie = await Categorie.findById(req.params.id);

    if (!categorie)
      return res.status(404).json({ message: "Catégorie introuvable" });

    if (nom && nom !== categorie.nom) {
      const exists = await Categorie.findOne({ nom });
      if (exists)
        return res.status(400).json({ message: "Nom déjà utilisé" });

      categorie.nom = nom;
    }

    if (description) categorie.description = description;

    await categorie.save();

    res.json({
      message: "Catégorie mise à jour",
      data: categorie,
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE
exports.deleteCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);

    if (!categorie)
      return res.status(404).json({ message: "Catégorie introuvable" });

    await categorie.deleteOne();

    res.json({ message: "Catégorie supprimée" });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// TOGGLE ACTIVE
exports.toggleCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);

    if (!categorie)
      return res.status(404).json({ message: "Catégorie introuvable" });

    categorie.isActive = !categorie.isActive;
    await categorie.save();

    res.json({
      message: categorie.isActive
        ? "Catégorie activée"
        : "Catégorie désactivée",
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
