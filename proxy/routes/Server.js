// GET /public/users/health → Health check da API
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/health`, { auth: AUTH });
    res.json(response.data);
  } catch (err) {
    console.error("Erro no GET /health:", err.message);
    res.status(500).json({ error: "Erro no health check" });
  }
});
