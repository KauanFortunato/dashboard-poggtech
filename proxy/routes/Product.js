import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import FormData from "form-data";
import multer from "multer";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

const API_BASE = process.env.API_BASE_URL;
const API_BASE_IMG = process.env.API_BASE_URL_IMG;
const AUTH = {
  username: process.env.API_USER,
  password: process.env.API_PASS,
};

// POST /public/products → criar produto
router.post("/", upload.array("images"), async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const formData = new FormData();

    // Adiciona os dados do produto
    Object.entries(req.body).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          formData.append(`${key}[]`, val);
        });
      } else {
        formData.append(key, value);
      }
    });

    // Adiciona as imagens com o nome correto
    req.files.forEach((file) => {
      formData.append("images[]", fs.createReadStream(file.path), file.originalname);
    });

    const response = await axios.post(`${API_BASE}/products`, formData, {
      auth: AUTH,
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao criar produto:", err.message);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// POST /public/products/:id → atualizar produto
router.post("/:id", upload.array("images"), async (req, res) => {
  try {
    const formData = new FormData();

    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    // Append todos os campos do body corretamente
    Object.entries(req.body).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          formData.append(`${key}[]`, val);
        });
      } else {
        formData.append(key, value);
      }
    });

    // Imagens novas
    if (req.files) {
      req.files.forEach((file) => {
        formData.append("images[]", fs.createReadStream(file.path), file.originalname);
      });
    }

    // Imagens já existentes (se ainda não estiverem no req.body)
    if (req.body.existing_images) {
      const existingImages = Array.isArray(req.body.existing_images) ? req.body.existing_images : [req.body.existing_images];

      existingImages.forEach((url) => {
        formData.append("existing_images[]", url);
      });
    }

    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const response = await axios.post(`${API_BASE}/products/admin/${req.params.id}`, formData, {
      auth: AUTH,
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao atualizar produto:", err.message);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// DELETE /public/products/:id → deletar produto
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(`${API_BASE}/products/${req.params.id}`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao deletar produto:", err.message);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

// POST /public/products/quantity → reduzir quantity
router.post("/quantity", async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE}/product/quantity`, req.body, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao reduzir quantidade do produto:", err.message);
    res.status(500).json({ error: "Erro ao reduzir quantidade" });
  }
});

// GET /public/products/:id → pegar produto por ID
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/products/${req.params.id}`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar produto:", err.message);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

// GET /public/products → listar todos os produtos
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/products`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao listar produtos:", err.message);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});

// GET /gallery/product/:id → pegar images de galeria de produto
router.get("/gallery/product/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/gallery/product/${req.params.id}`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao listar produtos:", err.message);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});

router.get("/proxy/uploads/:filename", async (req, res) => {
  const { filename } = req.params;

  const fullUrl = `http://${API_BASE_IMG}/uploads/${filename}`;

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
