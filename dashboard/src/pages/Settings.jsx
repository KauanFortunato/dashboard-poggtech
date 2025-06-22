import React, { useContext } from "react";
import { Button, Box, Typography } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

function SettingsPage() {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Configurações
      </Typography>
      <Button variant="outlined" color="error" onClick={handleLogout}>
        Sair
      </Button>
    </Box>
  );
}

export default SettingsPage;
