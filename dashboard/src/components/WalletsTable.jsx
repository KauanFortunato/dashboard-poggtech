import React, { useState, useEffect } from "react";
import { Box, Paper, Snackbar, Alert, CircularProgress, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

export default function WalletsTable() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editDialog, setEditDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [newBalance, setNewBalance] = useState("");
  const theme = useTheme();

  useEffect(() => {
    fetchWallets();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/wallet/`);
      setWallets(res.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar carteiras:", err);
      showSnackbar("Erro ao buscar carteiras.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (wallet) => {
    setSelectedWallet(wallet);
    setNewBalance(wallet.balance);
    setEditDialog(true);
  };

  const handleCloseEdit = () => {
    setEditDialog(false);
    setSelectedWallet(null);
    setNewBalance("");
  };

  const handleUpdateBalance = async () => {
    try {
      await axios.post(`${baseUrl}/api/wallet/${selectedWallet.user_id}/balance`, {
        balance: parseFloat(newBalance),
      });
      showSnackbar("Saldo atualizado com sucesso.");
      fetchWallets();
      handleCloseEdit();
    } catch (error) {
      console.error("Erro ao atualizar saldo:", error);
      showSnackbar("Erro ao atualizar saldo.", "error");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "user_id", headerName: "Utilizador", width: 100 },
    {
      field: "balance",
      headerName: "Saldo €",
      flex: 1,
      width: 120,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleOpenEdit(params.row)} size="small">
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <IconButton onClick={fetchWallets}>
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
        ) : wallets.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              Nenhuma carteira encontrada.
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={wallets}
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

      {/* Dialog para editar saldo */}
      <Dialog open={editDialog} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle>Editar Saldo</DialogTitle>
        <DialogContent>
          <TextField label="Novo Saldo (€)" type="number" fullWidth value={newBalance} onChange={(e) => setNewBalance(e.target.value)} margin="normal" inputProps={{ step: "0.01" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
          <Button onClick={handleUpdateBalance} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
