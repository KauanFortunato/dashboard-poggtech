import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert, CircularProgress, IconButton, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

export default function PaymentsTable() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDialog, setEditDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const theme = useTheme();

  useEffect(() => {
    fetchPayments();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/wallet/payments`);
      setPayments(res.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar pagamentos:", err);
      showSnackbar("Erro ao buscar pagamentos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setEditDialog(true);
  };

  const handleCloseEdit = () => {
    setEditDialog(false);
    setSelectedPayment(null);
    setNewStatus("");
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`${baseUrl}/api/wallet/payments/${selectedPayment.id}`, {
        status: newStatus,
      });

      showSnackbar("Status atualizado com sucesso.");
      fetchPayments();
      handleCloseEdit();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      showSnackbar("Erro ao atualizar status.", "error");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "user_id", headerName: "Usuário", width: 100 },
    {
      field: "order_id",
      headerName: "Pedido",
      width: 100,
      renderCell: ({ value }) => (value ? `#${value}` : "-"),
    },
    {
      field: "amount",
      headerName: "Valor",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: ({ value }) => {
        let color = "";
        let label = "";

        switch (value) {
          case "concluido":
            color = "#2e7d32"; // verde escuro
            label = "Concluído";
            break;
          case "pendente":
            color = "#f9a825"; // amarelo/laranja
            label = "Pendente";
            break;
          case "falhou":
            color = "#c62828"; // vermelho escuro
            label = "Falhou";
            break;
          default:
            label = value;
            color = "#555";
        }

        return <Typography sx={{ fontWeight: "bold", color }}>{label}</Typography>;
      },
      sortable: true,
      filterable: true,
    },
    {
      field: "created_at",
      headerName: "Data",
      flex: 1,
      width: 180,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" size="small" onClick={() => handleOpenEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <IconButton onClick={fetchPayments}>
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
        ) : payments.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              Nenhum pagamento encontrado.
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={payments}
            columns={columns}
            getRowId={(row) => row.id}
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

      {/* Modal de edição */}
      <Dialog open={editDialog} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle>Editar Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={newStatus} label="Status" onChange={(e) => setNewStatus(e.target.value)}>
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="concluido">Concluído</MenuItem>
              <MenuItem value="falhou">Falhou</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateStatus}>
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
  );
}
