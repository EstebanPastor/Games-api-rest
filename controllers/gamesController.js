const { pool } = require("../config/dataBase");

const getAllGames = async (req, res) => {
  try {
    const consult = "SELECT * FROM games ORDER BY id ASC";
    const result = await pool.query(consult);

    res.json({
      success: true,
      message: "Games fetched successfully",
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("❌ Error fetching games:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getGameByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    const consult = "SELECT * FROM games WHERE id = $1";
    const result = await pool.query(consult, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Game not found" });
    }

    res.json({
      success: true,
      message: "Game fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error fetching game:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const createGame = async (req, res) => {
  try {
    const {
      name,
      gender,
      platform,
      price,
      releasing_date,
      developers,
      description,
      register_date,
    } = req.body;

    if (!name || !gender || !platform || price === undefined) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: name, gender, platform, and price are mandatory",
      });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        error: "Price must be a valid positive number",
      });
    }

    const consult = `INSERT INTO games (name, gender, platform, price, releasing_date, developers, description, register_date) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const values = [
      name,
      gender,
      platform,
      price,
      releasing_date || null,
      developers || null,
      description || null,
      register_date || new Date(),
    ];

    const result = await pool.query(consult, values);

    res.status(201).json({
      success: true,
      message: "Game created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error creating a game:", error.message);
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ success: false, error: "Game already exists" });
    }
    res.status(500).json({ success: false, error: "Database error" });
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      gender,
      platform,
      price,
      releasing_date,
      developers,
      description,
      register_date,
    } = req.body;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    const consult = `
        UPDATE games
        SET name = $1, gender = $2, platform = $3, price = $4, releasing_date = $5, developers = $6, description = $7, register_date = $8
        WHERE id = $9
        RETURNING *
    `;

    const values = [
      name,
      gender,
      platform,
      price,
      releasing_date,
      developers,
      description,
      register_date,
      id,
    ];

    const result = await pool.query(consult, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Game updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error updating game:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Error while updating game" });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    const consult = "DELETE FROM games WHERE id = $1 RETURNING *";
    const result = await pool.query(consult, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Game not found",
      });
    }

    res.json({
      success: true,
      message: "Game deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error while deleting a game:", error.message);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllGames,
  getGameByID,
  createGame,
  updateGame,
  deleteGame,
};
