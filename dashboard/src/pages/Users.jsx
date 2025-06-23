import React from "react";
import { Typography, Box } from "@mui/material";
import UserTable from "../components/UsersTable";

function UsersPage({ currentUser }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Lista de utilizadores
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Visualize e gerencie os utilizadores.
      </Typography>

      <UserTable currentUser={currentUser} />
    </Box>
  );
}

export default UsersPage;
