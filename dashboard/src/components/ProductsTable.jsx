import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Dialog, Snackbar, Alert, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Button, Avatar, IconButton, CircularProgress, Typography, Paper, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

export default function ProductTable({ currentUser }) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const theme = useTheme();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      newImages.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [newImages]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/products`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      showSnackbar("Erro ao buscar produtos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (product) => {
    setEditProduct(product);
    setNewImages([]);
    try {
      const res = await axios.get(`${baseUrl}/api/products/gallery/product/${product.product_id}`);
      setGalleryImages(res.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar galeria:", err);
      setGalleryImages([]);
    }
  };

  const handleImageRemove = (url) => {
    setGalleryImages((prev) => prev.filter((imgUrl) => imgUrl !== url));
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${baseUrl}/api/products/${productId}`);
      setProducts((prev) => prev.filter((product) => product.product_id !== productId));
      showSnackbar("Produto deletado com sucesso.");
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      showSnackbar("Erro ao deletar produto.", "error");
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(editProduct).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => formData.append(`${key}[]`, val));
        } else {
          formData.append(key, value);
        }
      });
      galleryImages.forEach((url) => formData.append("existing_images[]", url));
      newImages.forEach((file) => formData.append("images", file));
      if (!editProduct.product_id) {
        formData.append("user_id", currentUser.user_id);
      }

      const url = editProduct.product_id ? `${baseUrl}/api/products/${editProduct.product_id}` : `${baseUrl}/api/products`;

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditProduct(null);
      fetchProducts();
      showSnackbar("Produto salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      showSnackbar("Erro ao salvar produto.", "error");
    }
  };

  const columns = [
    { field: "product_id", headerName: "ID", width: 80 },
    {
      field: "cover",
      headerName: "Capa",
      width: 100,
      renderCell: (params) => <Avatar src={params.value} variant="rounded" sx={{ width: 50, height: 50 }} />,
      sortable: false,
      filterable: false,
    },
    { field: "title", headerName: "Título", flex: 1 },
    { field: "price", headerName: "Preço", width: 100 },
    { field: "category", headerName: "Categoria", width: 140 },
    { field: "location", headerName: "Localização", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => deleteProduct(params.row.product_id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0 }}>
        <IconButton variant="contained" sx={{ p: 2 }} onClick={() => fetchProducts()}>
          <RefreshIcon />
        </IconButton>

        <IconButton
          variant="contained"
          sx={{ p: 2, color: theme.palette.primary.light }}
          onClick={() => {
            setEditProduct({
              title: "",
              description: "",
              price: "",
              location: "",
              category: "",
              cover: "",
            });
            setGalleryImages([]);
            setNewImages([]);
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: 2,
          boxShadow: theme.shadows[3],
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${theme.palette.divider}` }}>
            <DataGrid
              rows={products}
              columns={columns}
              getRowId={(row) => row.product_id}
              autoHeight
              pageSize={10}
              components={{ Toolbar: GridToolbar }}
              sx={{
                border: "none",
                fontSize: "0.95rem",
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: theme.palette.grey[100],
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                },
                "& .MuiDataGrid-row": {
                  transition: "background 0.2s",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                "& .MuiDataGrid-footerContainer": {
                  bgcolor: theme.palette.background.paper,
                },
              }}
            />
          </Paper>
        )}

        <Dialog open={!!editProduct} onClose={() => setEditProduct(null)} fullWidth maxWidth="md">
          <DialogTitle sx={{ fontWeight: 700 }}>Editar Produto</DialogTitle>

          <DialogContent sx={{ bgcolor: theme.palette.background.default }}>
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* Galeria de Imagens */}
              <Paper elevation={0} sx={{ p: 2, mb: 1, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
                <Typography fontWeight={600} mb={1}>
                  Galeria de Imagens
                </Typography>
                <Grid container spacing={2}>
                  {galleryImages.map((imgUrl, i) => (
                    <Grid item xs={6} sm={4} md={2} key={i}>
                      <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden", boxShadow: 1 }}>
                        <Avatar variant="rounded" src={imgUrl} sx={{ width: "100%", height: 100, mb: 0 }} />
                        <IconButton size="small" color="error" onClick={() => handleImageRemove(imgUrl)} sx={{ position: "absolute", top: 6, right: 6, bgcolor: "#fff", boxShadow: 1 }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}

                  {galleryImages.length + newImages.length < 6 && (
                    <Grid item xs={6} sm={4} md={2}>
                      <Button
                        component="label"
                        variant="outlined"
                        sx={{
                          width: "100%",
                          height: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 2,
                          borderColor: theme.palette.primary.main,
                        }}
                      >
                        <AddIcon fontSize="large" color="primary" />
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          name="images"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setNewImages(files);
                            const urls = files.map((file) => URL.createObjectURL(file));
                            setGalleryImages((prev) => [...prev, ...urls]);
                          }}
                        />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Informações principais */}
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField label="Título" value={editProduct?.title || ""} onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })} fullWidth required />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Preço" type="number" value={editProduct?.price || ""} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} fullWidth required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Descrição" multiline rows={3} value={editProduct?.description || ""} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Localização" value={editProduct?.location || ""} onChange={(e) => setEditProduct({ ...editProduct, location: e.target.value })} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Select fullWidth value={editProduct?.category || ""} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}>
                      <MenuItem value="Consolas">Consolas</MenuItem>
                      <MenuItem value="Jogos">Jogos</MenuItem>
                      <MenuItem value="Acessórios">Acessórios</MenuItem>
                      <MenuItem value="Colecionáveis">Colecionáveis</MenuItem>
                      <MenuItem value="Retro Gaming">Retro Gaming</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </DialogContent>

          <DialogActions sx={{ bgcolor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button onClick={() => setEditProduct(null)} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
