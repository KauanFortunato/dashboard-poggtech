import { auth } from "../firebase";
import { User } from "../models/User";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import { TextField, Button, Typography, Container, Box, Alert, ThemeProvider } from "@mui/material";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { login } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, senha);
      const firebaseUid = userCred.user.uid;

      // Buscar usuário no seu backend
      const res = await axios.get(`${baseUrl}/api/user/${firebaseUid}`);
      const data = await res.data.data;
      const user = new User(data);
      if (user.getType() != "admin") {
        throw new Error("Usuário não encontrado");
      }

      login(user);

      console.log("Usuário encontrado:", user);
      onLoginSuccess(user);
    } catch (err) {
      console.error("Erro no login:", err.message);
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Entrar
        </Typography>

        <TextField label="E-mail" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

        <TextField label="Senha" type="password" variant="outlined" fullWidth margin="normal" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />

        {erro && (
          <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
            {erro}
          </Alert>
        )}

        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleLogin}>
          Entrar
        </Button>
      </Box>
    </Container>
  );
}
