import React from "react";
import { Typography, Box } from "@mui/material";
import OrdersTable from "../components/OrdersTable";

function OrderPage({ currentUser }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Lista de pedidos
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Visualize e gerencie os pedidos feitos pelos utilizadores.
      </Typography>

      <OrdersTable currentUser={currentUser} />
    </Box>
  );
}

export default OrderPage;
