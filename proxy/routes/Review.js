import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";

const router = express.Router();

const API_BASE = process.env.API_BASE_URL;
const AUTH = {
  username: process.env.API_USER,
  password: process.env.API_PASS,
};

// GET /api/review/ → buscar avaliações
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/review`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar avaliações:", err.message);
    res.status(500).json({ error: "Erro ao buscar avaliações." });
  }
});

// POST /api/review → criar nova avaliação
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE}/review`, req.body, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao criar avaliação:", err.message);
    res.status(500).json({ error: "Erro ao criar avaliação." });
  }
});

// PUT /api/review → atualizar avaliação
router.put("/", async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.put(`${API_BASE}/review`, req.body, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.log(err);
    console.error("Erro ao atualizar avaliação:", err.message);
    res.status(500).json({ error: "Erro ao atualizar avaliação." });
  }
});

// DELETE /api/review/:product_id/:user_id → deletar avaliação
router.delete("/:product_id/:user_id", async (req, res) => {
  const { product_id, user_id } = req.params;
  try {
    const response = await axios.delete(`${API_BASE}/review/${product_id}/${user_id}`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao deletar avaliação:", err.message);
    res.status(500).json({ error: "Erro ao deletar avaliação." });
  }
});

export default router;
