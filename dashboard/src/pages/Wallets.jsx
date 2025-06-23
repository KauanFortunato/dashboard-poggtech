import React from "react";
import { Typography, Box } from "@mui/material";
import WalletsTable from "../components/WalletsTable";

function WalletsPage({ currentUser }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Lista de Carteiras
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Visualize e gerencie as carteiras vinculadas aos utilizadores.
      </Typography>

      <WalletsTable currentUser={currentUser} />
    </Box>
  );
}

export default WalletsPage;
