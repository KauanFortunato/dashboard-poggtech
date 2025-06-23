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

// GET /api/wallet/:user_id
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const response = await axios.get(`${API_BASE}/wallet/${user_id}`, { auth: AUTH });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET /api/wallet/:user_id
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/wallet/`, { auth: AUTH });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET /api/wallet/:user_id/payments
router.get("/:user_id/payments", async (req, res) => {
  try {
    const { user_id } = req.params;
    const response = await axios.get(`${API_BASE}/wallet/${user_id}/payments`, { auth: AUTH });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET /api/wallet/:user_id/payments -> get all payments
router.get("/payments", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/wallet/payments`, { auth: AUTH });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET /api/wallet/:user_id/payments -> Update status
router.put("/payments/:payment_id", async (req, res) => {
  try {
    const { payment_id } = req.params;

    const response = await axios.put(`${API_BASE}/wallet/payments/${payment_id}`, req.body, { auth: AUTH });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// POST /api/wallet/:user_id/deposit
router.post("/:user_id/deposit", async (req, res) => {
  try {
    console.log(req.body);
    const { user_id } = req.params;
    const response = await axios.post(`${API_BASE}/wallet/${user_id}/deposit`, req.body, { auth: AUTH });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// POST /api/wallet/:user_id/deposit
router.post("/:user_id/balance", async (req, res) => {
  try {
    console.log(req.body);
    const { user_id } = req.params;
    const response = await axios.post(`${API_BASE}/wallet/${user_id}/balance`, req.body, { auth: AUTH });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

export default router;
