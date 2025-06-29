import { auth } from "../firebase/firebase.js";
import { User } from "../models/User";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { TextField, Button, Typography, Container, Box, Alert, Avatar, Paper, useTheme } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { login } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_API_URL;
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, senha);
      const firebaseUid = userCred.user.uid;

      const res = await axios.get(`${baseUrl}/api/user/${firebaseUid}`);
      const data = await res.data.data;
      const user = new User(data);

      if (user.getType() !== "admin") {
        throw new Error("Usuário não autorizado");
      }

      login(user);
      onLoginSuccess(user);
    } catch (err) {
      console.error("Erro no login:", err.message);
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Avatar sx={{ m: "auto", mb: 2, bgcolor: theme.palette.primary.main }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" fontWeight={600} mb={2}>
          Acesso ao Painel
        </Typography>

        <TextField label="E-mail" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

        <TextField label="Senha" type="password" variant="outlined" fullWidth margin="normal" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />

        {erro && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {erro}
          </Alert>
        )}

        <Button fullWidth variant="contained" color="primary" sx={{ mt: 3, py: 1.5, borderRadius: 20 }} onClick={handleLogin}>
          Entrar
        </Button>
      </Paper>
    </Container>
  );
}
