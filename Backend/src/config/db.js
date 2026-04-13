const mongoose = require("mongoose");

/**
 * Fonction de connexion à MongoDB
 * Gère les erreurs et affiche des messages clairs
 */
const connectDB = async () => {
  try {
    // Tentative de connexion à MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // timeout pour éviter attente indéfinie en cas de problème de connexion
    });

    console.log(`MongoDB connecté avec succès sur : ${conn.connection.host}`);
  } catch (error) {
    // Gestion des erreurs de connexion
    console.error(" Erreur de connexion à MongoDB");

    if (error.message.includes("ECONNREFUSED")) {
      console.error("La base de données est inaccessible (MongoDB est peut-être arrêté)");
    } else if (error.message.includes("Authentication failed")) {
      console.error("La base de données est inaccessible (MongoDB est peut-être arrêté)");
    } else {
      console.error(`Détail de l'erreur : ${error.message}`);
    }

    // Arrêter l'application proprement
    process.exit(1);
  }
};

module.exports = connectDB;