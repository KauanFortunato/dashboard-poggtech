import React from "react";
import { Typography, Box } from "@mui/material";
import OrdersTable from "../components/OrdersTable";

function OrderPage({ currentUser }) {
  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom>
        Lista de Pedidos
      </Typography>

      <OrdersTable currentUser={currentUser} />
    </Box>
  );
}

export default OrderPage;
