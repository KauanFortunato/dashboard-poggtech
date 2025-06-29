import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { blue, purple, cyan } from "@mui/material/colors";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const DashboardPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [stats, setStats] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL + "/api/dashboard/";
      const [salesRes, dailyRes, usersRes, walletRes] = await Promise.all([
        axios.get(baseUrl + "products-sales"),
        axios.get(baseUrl + "daily-metrics"),
        axios.get(baseUrl + "monthly-active-users"),
        axios.get(baseUrl + "total-wallet"),
      ]);

      setStats([
        { label: "Total Vendas", value: salesRes.data.data.length, icon: <ShoppingCartIcon fontSize="large" /> },
        { label: "Faturamento Hoje", value: `€${dailyRes.data.data[0]?.total_revenue || 0}`, icon: <AttachMoneyIcon fontSize="large" /> },
        { label: "Novos Utilizadores Hoje", value: dailyRes.data.data[0]?.new_users || 0, icon: <PersonAddIcon fontSize="large" /> },
        { label: "Total Pedidos Hoje", value: dailyRes.data.data[0]?.total_orders || 0, icon: <InventoryIcon fontSize="large" /> },
        { label: "Utilizadores Ativos Mês", value: usersRes.data.data[0]?.active_users || 0, icon: <GroupsIcon fontSize="large" /> },
        { label: "Saldo Total", value: `€${walletRes.data.data?.total_balance || 0}`, icon: <AccountBalanceWalletIcon fontSize="large" /> },
      ]);

      setLineData(
        dailyRes.data.data.map((item) => ({
          name: item.day,
          uv: parseFloat(item.total_revenue),
          pv: parseInt(item.total_orders),
        }))
      );

      setBarData(
        salesRes.data.data.slice(0, 6).map((item) => ({
          name: item.product_name,
          a: parseInt(item.total_quantity_sold),
          b: parseInt(item.total_sales),
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar dados da dashboard:", error);
    }
  };

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ transition: "all 0.3s ease" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Dashboard Principal
      </Typography>

      <Grid container spacing={3} mb={4} sx={{ transition: "all 0.3s ease" }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} key={i} flex={1} minWidth={180} maxWidth={500}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                height: 160,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "rgba(0, 17, 255, 0.2)",
              }}
              elevation={0}
            >
              <Box mb={1} sx={{ transition: "all 0.3s ease" }}>
                {stat.icon}
              </Box>
              <Typography variant="body1" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h5" fontWeight="bold" mt={1}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ transition: "all 0.3s ease" }}>
        <Grid item xs={12} md={12} lg={6} flex={1} sx={{ transition: "all 0.3s ease" }}>
          <Paper sx={{ p: 4, borderRadius: 4, minHeight: 400, backgroundColor: "rgba(0, 0, 0, 0.02)" }} elevation={0}>
            <Typography fontWeight={600} mb={2}>
              Receita vs Pedidos
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uv" stroke={blue[500]} strokeWidth={3} name="Receita" />
                <Line type="monotone" dataKey="pv" stroke={cyan[500]} strokeWidth={3} name="Pedidos" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={6} flex={1}>
          <Paper sx={{ p: 4, borderRadius: 4, minHeight: 400, backgroundColor: "rgba(0, 0, 0, 0.02)" }} elevation={0}>
            <Typography fontWeight={600} mb={2}>
              Produtos Vendidos
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="a" fill={blue[400]} radius={[5, 5, 0, 0]} name="Qtd Vendida" />
                <Bar dataKey="b" fill={purple[400]} radius={[5, 5, 0, 0]} name="Nº Vendas" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
