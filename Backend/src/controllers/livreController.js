const Livre = require("../models/livre.js");
const Categorie = require("../models/categorie.js");

// build search query for GET /livres and GET /livres/visiteur
const buildSearchQuery = (search, onlyActive = false) => {
  const query = onlyActive ? { isActive: true } : {};

  if (search) {
    query.$or = [
      { titre: { $regex: search, $options: "i" } },
      { auteur: { $regex: search, $options: "i" } },
    ];
  }

  return query;
};

// CREATE
exports.createLivre = async (req, res) => {
  try {
    const { titre, auteur, isbn, categorie, quantite } = req.body;

    const exist = await Livre.findOne({ isbn });
    if (exist)
      return res.status(400).json({ message: "ISBN déjà utilisé" });

    const cat = await Categorie.findById(categorie);
    if (!cat)
      return res.status(404).json({ message: "Catégorie introuvable" });

    const livre = await Livre.create({
      titre,
      auteur,
      isbn,
      categorie,
      quantite,
      exemplairesDisponibles: quantite,
    });

    res.status(201).json({
      message: "Livre ajouté",
      data: livre,
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET ALL + SEARCH
exports.getLivres = async (req, res) => {
  try {
    const { search } = req.query;
    const query = buildSearchQuery(search);

    const livres = await Livre.find(query).populate("categorie");

    res.json({
      count: livres.length,
      data: livres,
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET ALL + SEARCH (PUBLIC VISITOR)
exports.getLivresVisiteur = async (req, res) => {
  try {
    const { search } = req.query;
    const query = buildSearchQuery(search, true);

    const livres = await Livre.find(query).populate("categorie");

    res.json({
      count: livres.length,
      data: livres,
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET BY ID
exports.getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id).populate("categorie");

    if (!livre)
      return res.status(404).json({ message: "Livre introuvable" });

    res.json(livre);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// UPDATE
exports.updateLivre = async (req, res) => {
  try {
    const { titre, auteur, quantite } = req.body;

    const livre = await Livre.findById(req.params.id);

    if (!livre)
      return res.status(404).json({ message: "Livre introuvable" });

    if (titre) livre.titre = titre;
    if (auteur) livre.auteur = auteur;

    if (quantite !== undefined) {
      const diff = quantite - livre.quantite;

      livre.quantite = quantite;
      livre.exemplairesDisponibles += diff;

      if (livre.exemplairesDisponibles < 0) {
        return res.status(400).json({
          message: "Stock invalide (livres déjà empruntés)",
        });
      }
    }

    await livre.save();

    res.json({
      message: "Livre mis à jour",
      data: livre,
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE
exports.deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);

    if (!livre)
      return res.status(404).json({ message: "Livre introuvable" });

    await livre.deleteOne();

    res.json({ message: "Livre supprimé" });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// TOGGLE
exports.toggleLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);

    if (!livre)
      return res.status(404).json({ message: "Livre introuvable" });

    livre.isActive = !livre.isActive;
    await livre.save();

    res.json({
      message: livre.isActive ? "Livre activé" : "Livre désactivé",
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
