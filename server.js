require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { testConnection, pool } = require("./config/dataBase");
const {
  getAllGames,
  getGameByID,
  createGame,
  updateGame,
  deleteGame,
} = require("./controllers/gamesController");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/games", getAllGames);
app.get("/api/games/:id", getGameByID);
app.post("/api/games", createGame);
app.put("/api/games/:id", updateGame);
app.delete("/api/games/:id", deleteGame);

const initServer = async () => {
  try {
    await testConnection();

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Error initializing the server:", error.message);
    process.exit(1);
  }
};

initServer();
