import express from "express";
import axios from "axios";

const router = express.Router();

const API_BASE = process.env.API_BASE_URL;
const AUTH = {
  username: process.env.API_USER,
  password: process.env.API_PASS,
};

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/category`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar categorias:", err.message);
    res.status(500).json({ error: "Erro ao conectar com a API PHP" });
  }
});

// GET /api/categories/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE}/category/${id}`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar categoria:", err.message);
    res.status(500).json({ error: "Erro ao conectar com a API PHP" });
  }
});

export default router;
