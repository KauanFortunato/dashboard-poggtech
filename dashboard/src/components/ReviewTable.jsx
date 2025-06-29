import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, IconButton, TextField, Select, MenuItem, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function ReviewTable({ productId, currentUser }) {
  const theme = useTheme();

  const baseUrl = import.meta.env.VITE_API_URL;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editReview, setEditReview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/review`, {
        params: { product_id: productId || undefined },
      });
      setReviews(res.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar avaliações:", err);
      showSnackbar("Erro ao buscar avaliações.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleDelete = async (review) => {
    try {
      await axios.delete(`${baseUrl}/api/review/${review.product_id}/${review.user_id}`);
      setReviews((prev) => prev.filter((r) => r.user_id !== review.user_id));
      showSnackbar("Avaliação deletada com sucesso.");
    } catch (err) {
      console.error("Erro ao deletar avaliação:", err);
      showSnackbar("Erro ao deletar avaliação.", "error");
    }
  };

  const handleSave = async () => {
    const isEdit = !!editReview?.user_id && !!editReview?.product_id;
    if (!isEdit) return; // só salva se for edição, não criação
    try {
      await axios.put(`${baseUrl}/api/review`, {
        ...editReview,
        product_id: productId,
        user_id: currentUser.user_id,
      });
      fetchReviews();
      setEditReview(null);
      showSnackbar("Avaliação salva com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar avaliação:", err);
      showSnackbar("Erro ao salvar avaliação.", "error");
    }
  };

  const columns = [
    { field: "user_id", headerName: "Utilizador", width: 100 },
    { field: "product_id", headerName: "Produto", width: 100 },
    { field: "rating", headerName: "Nota", width: 100 },
    { field: "comment", headerName: "Comentário", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => setEditReview(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: theme.shadows[3],
        }}
      >
        <DataGrid
          rows={reviews}
          columns={columns}
          getRowId={(row) => `${row.product_id}_${row.user_id}`}
          autoHeight
          loading={loading}
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

      <Dialog open={!!editReview} onClose={() => setEditReview(null)} fullWidth maxWidth="sm">
        <DialogTitle>Avaliação</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Comentário" multiline rows={3} value={editReview?.comment || ""} onChange={(e) => setEditReview({ ...editReview, comment: e.target.value })} />
          <Select value={editReview?.rating || 5} onChange={(e) => setEditReview({ ...editReview, rating: parseInt(e.target.value) })} fullWidth>
            {[1, 2, 3, 4, 5].map((star) => (
              <MenuItem key={star} value={star}>
                {star} Estrela{star > 1 ? "s" : ""}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditReview(null)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
