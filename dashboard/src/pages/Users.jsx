import React from "react";
import { Typography, Box } from "@mui/material";
import UserTable from "../components/UsersTable";

function UsersPage({ currentUser }) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom>
        Lista de Utilizadores
      </Typography>

      <UserTable currentUser={currentUser} />
    </Box>
  );
}

export default UsersPage;
