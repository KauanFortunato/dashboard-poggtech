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

// GET /public/order → listar todos os pedidos
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/order`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao listar pedidos:", err.message);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

// PUT /public/order/{order_id}/{newStatus}
router.put("/:id/:newStatus", async (req, res) => {
  try {
    const response = await axios.put(`${API_BASE}/order/${req.params.id}/${req.params.newStatus}`, null, {
      auth: AUTH,
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    console.error("Erro ao atualizar pedidos:", err.message);
    res.status(500).json({ error: "Erro ao atualizar pedido" });
  }
});

export default router;
