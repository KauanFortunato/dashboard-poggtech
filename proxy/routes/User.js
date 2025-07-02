import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";

const router = express.Router();

const API_BASE = process.env.API_BASE_URL;
const API_BASE_IMG = process.env.API_BASE_URL_IMG;
const AUTH = {
  username: process.env.API_USER,
  password: process.env.API_PASS,
};

// POST /public/user → Cadastro de usuário
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE}/user`, req.body, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro no POST /user:", err.message);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// GET /public/user/:firebase_uid → Buscar usuário pelo firebase_uid
router.get("/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const response = await axios.get(`${API_BASE}/user/${firebase_uid}`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro no GET /user/:firebase_uid:", err.message);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// PUT /public/user → Atualizar usuário
router.put("/", async (req, res) => {
  try {
    const response = await axios.put(`${API_BASE}/user`, req.body, { auth: AUTH });
    console.log(response);
    res.json(response.data);
  } catch (err) {
    console.error("Erro no PUT /user:", err.message);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// PUT /public/user/{user_id}/email
router.put("/email", async (req, res) => {
  try {
    const response = await axios.put(`${API_BASE}/user/email`, req.body, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.log(err);
    console.error("Erro no PUT /user/firebase_uid/email:", err.message);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// PUT /public/user/blockUn
router.put("/active", async (req, res) => {
  try {
    const response = await axios.put(`${API_BASE}/user/active`, req.body, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro no PUT /user/firebase_uid/email:", err.message);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// POST /public/user/avatar → Atualizar avatar do usuário (upload de arquivo)
router.post("/avatar", async (req, res) => {
  try {
    if (!req.body.firebase_uid || !req.files?.avatar) {
      return res.status(400).json({ error: "Dados incompletos para atualizar avatar" });
    }

    // Montar form-data para enviar arquivo para API PHP
    const formData = new FormData();
    formData.append("firebase_uid", req.body.firebase_uid);
    formData.append("avatar", fs.createReadStream(req.files.avatar.path), req.files.avatar.name);

    const response = await axios.post(`${API_BASE}/user/avatar`, formData, {
      auth: AUTH,
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erro no POST /user/avatar:", err.message);
    res.status(500).json({ error: "Erro ao atualizar avatar" });
  }
});

// GET /public/user/id/:user_id → Buscar usuário pelo user_id (numérico)
router.get("/id/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const url = `${API_BASE}/user/id/${user_id}`;
    console.log(">> URL chamada:", url); // ADICIONE ISSO

    const response = await axios.get(url, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro no GET /user/id/:user_id:", err.message);
    res.status(500).json({ error: "Erro ao buscar usuário por ID" });
  }
});

// DELETE /public/user/delete/:firebase_uid → Deletar usuário
router.delete("/delete/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const response = await axios.delete(`${API_BASE}/user/delete/${firebase_uid}`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro no DELETE /user/delete/:firebase_uid:", err.message);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// GET /public/user → Listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/user`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err.message);
    res.status(500).json({ error: "Erro ao conectar com a API PHP" });
  }
});

router.get("/proxy/avatar/:filename", async (req, res) => {
  const { filename } = req.params;

  const fullUrl = `${API_BASE_IMG}/uploads/avatars/${filename}`;

  try {
    const response = await axios.get(fullUrl, {
      responseType: "arraybuffer",
      auth: AUTH,
    });

    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (error) {
    console.error("Erro ao buscar imagem:", error.message);
    res.status(500).send("Erro ao carregar imagem");
  }
});

export default router;
