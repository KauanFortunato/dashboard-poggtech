import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";
import e from "express";

const router = express.Router();
const API_BASE = process.env.API_BASE_URL;
const AUTH = {
  username: process.env.API_USER,
  password: process.env.API_PASS,
};

router.get("/products-sales", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard/products-sales`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.log(err);
    console.error("Erro ao buscar vendas por produto:", err.message);
    res.status(500).json({ error: "Erro ao buscar vendas por produto" });
  }
});

router.get("/daily-metrics", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard/daily-metrics`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar métricas diárias:", err.message);
    res.status(500).json({ error: "Erro ao buscar métricas diárias" });
  }
});

router.get("/monthly-active-users", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard/monthly-active-users`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar utilizadores ativos:", err.message);
    res.status(500).json({ error: "Erro ao buscar utilizadores ativos" });
  }
});

router.get("/total-wallet", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard/total-wallet`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar saldo total:", err.message);
    res.status(500).json({ error: "Erro ao buscar saldo total" });
  }
});

export default router;
