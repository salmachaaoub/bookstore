const express = require("express");
const cors = require("cors");

const app = express();

const originesAutorisees = (process.env.CORS_ORIGIN ||
  "http://localhost:5173,http://localhost:3000")
  .split(",")
  .map((origine) => origine.trim())
  .filter(Boolean);

const optionsCors = {
  origin: (origin, callback) => {
    // Autorise les clients sans origin (Postman, scripts serveurs, etc.).
    if (!origin || originesAutorisees.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`Origine CORS non autorisee: ${origin}`)
    );
  },
  credentials: true,
};

// Middleware
app.use(cors(optionsCors));
app.use(express.json());

// Routes
const routes = require("./routes");
app.use("/api", routes);

// Route test
app.get("/", (req, res) => {
  res.send("API Bibliothèque fonctionne 🚀");
});

module.exports = app;
