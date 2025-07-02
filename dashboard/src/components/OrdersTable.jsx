import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Paper, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";

export default function OrderTable({ currentUser }) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/orders/`);
      setOrders(res.data.data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${baseUrl}/api/orders/${orderId}/${newStatus}`);
      setSnackbar({
        open: true,
        message: "Status de envio atualizado com sucesso!",
        severity: "success",
      });
      // Atualizar localmente
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, shipping_status: newStatus } : order)));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setSnackbar({
        open: true,
        message: "Erro ao atualizar status de envio.",
        severity: "error",
      });
    }
  };

  const handleRowUpdate = async (updatedRow, oldRow) => {
    if (updatedRow.shipping_status !== oldRow.shipping_status) {
      await handleStatusUpdate(updatedRow.id, updatedRow.shipping_status);
    }
    return updatedRow;
  };

  const shippingOptions = ["confirmado", "enviado", "transito", "entregue", "cancelado"];

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "user_name", headerName: "Cliente", flex: 1 },
    { field: "user_phone", headerName: "Telefone", width: 140 },
    { field: "location", headerName: "Localização", flex: 1 },
    { field: "total_amount", headerName: "Total (€)", width: 100 },
    {
      field: "status",
      headerName: "Status do Pedido",
      width: 140,
      renderCell: (params) => {
        let color = "orange";
        if (params.value === "pago") color = "green";
        else if (params.value === "cancelado") color = "red";
        return (
          <Typography variant="body2" sx={{ color }}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "shipping_status",
      headerName: "Envio",
      width: 140,
      type: "singleSelect",
      valueOptions: shippingOptions,
      editable: true,
      renderCell: (params) => (
        <Typography variant="body2" color={params.value === "confirmado" ? "primary" : params.value === "enviado" ? "secondary" : params.value === "entregue" ? "green" : "textSecondary"}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "created_at",
      headerName: "Data",
      width: 160,
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0 }}>
        <IconButton variant="contained" sx={{ p: 2 }} onClick={() => fetchOrders()}>
          <RefreshIcon />
        </IconButton>
      </Box>

      <Box p={2}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper
            elevation={1}
            sx={{
              borderRadius: 5,
              overflow: "hidden",
              boxShadow: theme.shadows[3],
            }}
          >
            <DataGrid
              rows={orders}
              columns={columns}
              getRowId={(row) => row.id}
              autoHeight
              pageSize={10}
              components={{ Toolbar: GridToolbar }}
              disableSelectionOnClick
              processRowUpdate={handleRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
              sx={{
                border: "none",
                fontSize: "0.95rem",
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: theme.palette.grey[100],
                  fontWeight: 600,
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            />
          </Paper>
        )}

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
