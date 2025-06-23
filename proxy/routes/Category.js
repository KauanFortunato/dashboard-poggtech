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

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/category`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.log(err);
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

// Criar categoria (POST /api/category)
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE}/category`, req.body, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao criar categoria:", err.message);
    res.status(500).json({ error: "Erro ao criar categoria." });
  }
});

// Atualizar categoria (PUT /api/category/:id)
router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(`${API_BASE}/category/${req.params.id}`, req.body, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao atualizar categoria:", err.message);
    res.status(500).json({ error: "Erro ao atualizar categoria." });
  }
});

// Deleta categoria (DELETE /api/category/:id)
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(`${API_BASE}/category/${req.params.id}`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao deletar categoria:", err.message);
    res.status(500).json({ error: "Erro ao deletar categoria." });
  }
});

export default router;
