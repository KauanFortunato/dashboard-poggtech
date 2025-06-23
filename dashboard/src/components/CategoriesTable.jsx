import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert, CircularProgress, IconButton, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

export default function CategoriesTable() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [editDialog, setEditDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", icon: "", description: "" });
  const theme = useTheme();

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/category`);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      showSnackbar("Erro ao buscar categorias.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setFormValues({
      name: category.name,
      icon: category.icon,
      description: category.description,
    });
    setIsCreating(false);
    setEditDialog(true);
  };

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setFormValues({ name: "", icon: "", description: "" });
    setIsCreating(true);
    setEditDialog(true);
  };

  const handleCloseEdit = () => {
    setEditDialog(false);
    setSelectedCategory(null);
    setFormValues({ name: "", icon: "", description: "" });
    setIsCreating(false);
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.put(`${baseUrl}/api/category/${selectedCategory.category_id}`, formValues);
      showSnackbar("Categoria atualizada com sucesso.");
      fetchCategories();
      handleCloseEdit();
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
      showSnackbar("Erro ao atualizar categoria.", "error");
    }
  };

  const handleCreateCategory = async () => {
    try {
      await axios.post(`${baseUrl}/api/category`, formValues);
      showSnackbar("Categoria criada com sucesso.");
      fetchCategories();
      handleCloseEdit();
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
      showSnackbar("Erro ao criar categoria.", "error");
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirm = window.confirm(`Deseja realmente excluir a categoria "${category.name}"?`);
    if (!confirm) return;

    try {
      await axios.delete(`${baseUrl}/api/category/${category.category_id}`);
      showSnackbar("Categoria deletada com sucesso.");
      fetchCategories();
    } catch (err) {
      console.error("Erro ao deletar categoria:", err);
      showSnackbar("Erro ao deletar categoria.", "error");
    }
  };

  const columns = [
    { field: "category_id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "icon", headerName: "Ícone", flex: 1 },
    { field: "description", headerName: "Descrição", flex: 2 },
    {
      field: "created_at",
      headerName: "Criado em",
      width: 180,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton color="primary" size="small" onClick={() => handleOpenEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDeleteCategory(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "right", mb: 1 }}>
        <IconButton variant="contained" sx={{ p: 2, color: theme.palette.primary.light }} onClick={handleOpenCreate}>
          <AddIcon />
        </IconButton>

        <IconButton onClick={fetchCategories}>
          <RefreshIcon />
        </IconButton>
      </Box>

      <Paper
        elevation={1}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: theme.shadows[3],
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              Nenhuma categoria encontrada.
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={categories}
            columns={columns}
            getRowId={(row) => row.category_id}
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
        )}
      </Paper>

      {/* Modal de criação/edição */}
      <Dialog open={editDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>{isCreating ? "Nova Categoria" : "Editar Categoria"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nome" value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} margin="normal" />
          <TextField fullWidth label="Ícone" value={formValues.icon} onChange={(e) => setFormValues({ ...formValues, icon: e.target.value })} margin="normal" />
          <TextField fullWidth label="Descrição" value={formValues.description} onChange={(e) => setFormValues({ ...formValues, description: e.target.value })} margin="normal" multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
          <Button variant="contained" onClick={isCreating ? handleCreateCategory : handleUpdateCategory}>
            {isCreating ? "Criar" : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
