import React, { useContext } from "react";
import { Box, Typography, Avatar, Card, CardContent, Grid, Divider } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

function SettingsPage({ currentUser }) {
  const baseUrl = import.meta.env.VITE_API_URL;

  const { user, logout } = useContext(AuthContext);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Perfil do Administrador
      </Typography>

      <Card sx={{ p: 4, mb: 5, borderRadius: 3, minHeight: 280, alignContent: "center" }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
            <Avatar
              src={`${baseUrl}/api/user/proxy/avatar/${user?.avatar.split("/").pop()}`}
              alt={user?.name}
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                border: "2px solid #ccc",
              }}
            />
            <Typography variant="subtitle1" mt={2} fontWeight={600}>
              {user?.name}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={9}>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1">{user?.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Telefone
                  </Typography>
                  <Typography variant="body1">{user?.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tipo de Utilizador
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                    {user?.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Criado em
                  </Typography>
                  <Typography variant="body1">{user?.created_at}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      <Box sx={{ textAlign: "right" }}>
        <Typography
          variant="body2"
          onClick={logout}
          sx={{
            color: "error.main",
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Terminar sessão
        </Typography>
      </Box>
    </Box>
  );
}

export default SettingsPage;
