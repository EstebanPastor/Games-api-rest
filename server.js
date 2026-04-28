require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const path = require("path");
const { testConnection } = require("./config/dataBase");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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
