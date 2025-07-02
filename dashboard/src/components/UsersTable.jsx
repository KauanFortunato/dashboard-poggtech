import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Avatar, CircularProgress, Snackbar, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useTheme } from "@mui/material/styles";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function UserTable({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editEmailUser, setEditEmailUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const baseUrl = import.meta.env.VITE_API_URL;
  const auth = getAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);

    try {
      const res = await axios.get(`${baseUrl}/api/user/`);
      setUsers(res.data.data);
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
      showSnackbar("Erro ao buscar utilizadores.", "error");
    } finally {
      setLoading(false);
    }
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  async function deleteUser(firebaseUid, userId) {
    try {
      await axios.delete(`${baseUrl}/api/firebase/${firebaseUid}`);

      await axios.delete(`${baseUrl}/api/user/delete/${firebaseUid}`);

      showSnackbar("Utilizador deletado com successo.");
      setUsers((prev) => prev.filter((user) => user.user_id !== userId));
    } catch (error) {
      console.error("Erro ao deletar utilizador:", error);

      if (error.response?.config?.url?.includes("/firebase/")) {
        showSnackbar("Erro ao deletar utilizador no Firebase.", "error");
      } else {
        showSnackbar("Erro ao deletar utilizador no banco de dados.", "error");
      }
    }
  }

  const handleEditSave = async () => {
    try {
      await axios.put(`${baseUrl}/api/user/`, editUser);
      setUsers((prev) => prev.map((u) => (u.user_id === editUser.user_id ? editUser : u)));
      showSnackbar("Utilizador salvo com sucesso!");
      setEditUser(null);
    } catch (error) {
      showSnackbar("Erro ao atualizar utilizador", "error");
      console.error("Erro ao atualizar utilizador:", error);
    }
  };

  const handleEmailSave = async (firebaseUid) => {
    try {
      console.log(firebaseUid);
      await axios.put(`${baseUrl}/api/firebase/${firebaseUid}/email`, { email: editEmailUser.email });

      await axios.put(`${baseUrl}/api/user/email`, {
        email: editEmailUser.email,
        user_id: editEmailUser.user_id,
      });

      setUsers((prev) => prev.map((u) => (u.user_id === editEmailUser.user_id ? { ...u, email: editEmailUser.email } : u)));

      showSnackbar("Email atualizado com sucesso.");
      setEditEmailUser(null);
    } catch (error) {
      console.error("Erro ao atualizar email:", error);
      showSnackbar("Erro ao atualizar email.", "error");
    }
  };

  const toggleUserActive = async (user) => {
    const { firebase_uid, user_id, isActive } = user;

    try {
      // Chamada para o Firebase via seu proxy (bloqueio/desbloqueio)
      await axios.put(`${baseUrl}/api/firebase/${firebase_uid}/active`, { isActive: !isActive });

      // Atualiza o banco de dados
      await axios.put(`${baseUrl}/api/user/active`, { user_id, isActive: !isActive });

      // Atualiza estado local
      setUsers((prev) => prev.map((u) => (u.user_id === user_id ? { ...u, isActive: !isActive } : u)));

      showSnackbar(`Utilizador ${!isActive ? "ativado" : "bloqueado"} com sucesso.`);
    } catch (error) {
      console.error("Erro ao alterar status do utilizador:", error);
      showSnackbar("Erro ao alterar status do utilizador.", "error");
    }
  };

  const handleCreateUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const firebaseUser = userCredential.user;

      const res = await axios.post(`${baseUrl}/api/user`, {
        ...newUser,
        firebase_uid: firebaseUser.uid,
      });

      const created = res.data.data;

      fetchUsers();
      showSnackbar("Utilizador criado com sucesso!");
      setNewUser(null);
    } catch (error) {
      console.error("Erro ao criar utilizador:", error);
      showSnackbar("Erro ao criar utilizador.", "error");
    }
  };

  const columns = [
    { field: "user_id", headerName: "ID", width: 90 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) => {
        const fileName = params.value?.split("/").pop();
        return <Avatar src={`${baseUrl}/api/user/proxy/avatar/${fileName}`} sx={{ width: 36, height: 36 }} />;
      },
      sortable: false,
      filterable: false,
    },
    { field: "name", headerName: "Nome", flex: 1, minWidth: 140 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "phone", headerName: "Telemóvel", width: 140 },
    {
      field: "type",
      headerName: "Tipo",
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            color: params.value === "admin" ? theme.palette.error.main : theme.palette.text.primary,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "created_at",
      headerName: "Criado em",
      width: 130,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => setEditUser(params.row)} sx={{ "&:hover": { color: theme.palette.primary.dark } }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="info" onClick={() => setEditEmailUser(params.row)} sx={{ "&:hover": { color: theme.palette.info.dark } }}>
            <MailOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton color={params.row.isActive ? "success" : "warning"} onClick={() => toggleUserActive(params.row)} sx={{ "&:hover": { color: theme.palette[params.row.isActive ? "success" : "warning"].dark } }}>
            {params.row.isActive ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
          </IconButton>

          <IconButton color="error" onClick={() => deleteUser(params.row.firebase_uid, params.row.user_id)} sx={{ "&:hover": { color: theme.palette.error.dark } }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),

      sortable: false,
      filterable: false,
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0 }}>
        <IconButton variant="contained" sx={{ p: 2 }} onClick={() => fetchUsers()}>
          <RefreshIcon />
        </IconButton>

        <IconButton variant="contained" sx={{ p: 2, color: theme.palette.primary.light }} onClick={() => setNewUser({ name: "", email: "", phone: "", type: "user" })}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: 2,
          boxShadow: theme.shadows[3],
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            sx={{
              borderRadius: 5,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.action.hover,
                fontWeight: "bold",
                fontSize: 16,
                color: theme.palette.text.primary,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.selected,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
            }}
            rows={users}
            columns={columns}
            getRowId={(row) => row.user_id}
            pageSize={10}
            rowsPerPageOptions={[10, 25]}
            components={{ Toolbar: GridToolbar }}
          />
        )}

        <Dialog
          open={!!editUser}
          onClose={() => setEditUser(null)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2,
              minWidth: 400,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>Editar Utilizador</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField label="Nome" value={editUser?.name || ""} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} fullWidth />
            <TextField label="Telemóvel" value={editUser?.phone || ""} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} fullWidth />

            <Select
              label="Tipo"
              value={editUser?.type || ""}
              onChange={(e) => setEditUser({ ...editUser, type: e.target.value })}
              fullWidth
              sx={{ mt: 1 }}
              disabled={editUser?.user_id === currentUser.user_id && editUser?.type === "admin"}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditUser(null)} variant="outlined" color="inherit">
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleEditSave}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={!!editEmailUser}
          onClose={() => setEditEmailUser(null)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2,
              minWidth: 400,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            },
          }}
        >
          <DialogTitle>Alterar Email</DialogTitle>
          <DialogContent>
            <TextField label="Novo Email" type="email" value={editEmailUser?.email || ""} onChange={(e) => setEditEmailUser({ ...editEmailUser, email: e.target.value })} fullWidth autoFocus sx={{ mt: 1 }} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditEmailUser(null)} variant="outlined" color="inherit">
              Cancelar
            </Button>
            <Button onClick={() => handleEmailSave(editEmailUser?.firebase_uid)} variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={!!newUser}
          onClose={() => setNewUser(null)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2,
              minWidth: 400,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            },
          }}
        >
          <DialogTitle>Novo Utilizador</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Nome" value={newUser?.name || ""} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} fullWidth />
            <TextField label="Email" type="email" value={newUser?.email || ""} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} fullWidth />
            <TextField label="Senha" type="password" value={newUser?.password || ""} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} fullWidth />
            <TextField label="Telemóvel" value={newUser?.phone || ""} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} fullWidth />
            <Select label="Tipo" value={newUser?.type || "user"} onChange={(e) => setNewUser({ ...newUser, type: e.target.value })} fullWidth>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setNewUser(null)} variant="outlined" color="inherit">
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCreateUser}>
              Criar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
