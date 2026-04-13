const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const app = require("./app");

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Impossible de démarrer le serveur sans base de données");
  }
};

startServer();
