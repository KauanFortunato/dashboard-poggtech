import React from "react";
import { Typography, Box } from "@mui/material";
import PaymentsTable from "../components/PaymentsTable";

function PaymentsPage() {
  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom>
        Lista de Produtos
      </Typography>

      <PaymentsTable currentUser={currentUser} />
    </Box>
  );
}

export default PaymentsPage;
