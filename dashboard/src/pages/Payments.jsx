import React from "react";
import { Typography, Box } from "@mui/material";
import PaymentsTable from "../components/PaymentsTable";

function PaymentsPage({ currentUser }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Lista de pagamentos
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Visualize e gerencie os pagamentos.
      </Typography>

      <PaymentsTable currentUser={currentUser} />
    </Box>
  );
}

export default PaymentsPage;
