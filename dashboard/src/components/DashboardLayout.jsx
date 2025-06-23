import React, { useState } from "react";
import { Box, Drawer, InputBase, AppBar, Toolbar, Paper, Typography, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, IconButton, Collapse, Divider, ListSubheader } from "@mui/material";
import { useLocation } from "react-router-dom";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import WaterfallChartIcon from "@mui/icons-material/WaterfallChart";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import CategoryIcon from "@mui/icons-material/Category";
import WalletIcon from "@mui/icons-material/Wallet";
import logo from "../assets/logo.png";
import logoIcon from "../assets/logo_icon.png";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const drawerWidth = 260;
const collapsedWidth = 72;

export default function DashboardLayout({ user, children, darkMode, toggleDarkMode }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const avatarFilename = user?.avatar?.split("/").pop();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [openClientes, setOpenClientes] = useState(false);

  // Menus
  const menuItemsTop = [
    { text: "Produtos", icon: <ShoppingCartIcon />, path: "/products" },
    { text: "Pedidos", icon: <InventoryIcon />, path: "/orders" },
    { text: "Categorias", icon: <CategoryIcon />, path: "/categories" },
    { text: "Pagamentos", icon: <PaymentIcon />, path: "/payments" },
    { text: "Carteiras", icon: <WalletIcon />, path: "/wallets" },
    { text: "Avaliações", icon: <StarHalfIcon />, path: "/reviews" },
  ];

  const configItem = { icon: <SettingsIcon />, path: "/settings", tooltip: "Configurações" };

  return (
    <Box sx={{ display: "flex", bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            color: theme.palette.text.primary,
            display: "flex",
            flexDirection: "column",
            borderRadius: "0 0 32px 0",
            boxShadow: "6px 0 20px rgba(0,0,0,0.1)",
            backgroundColor: theme.palette.background.paper,
            justifyContent: "space-between",
            px: 2,
            py: 3,
            transition: "all 0.3s ease",
            m: 0,
            height: "100vh", // garante altura da tela
            overflow: "hidden", // remove o scroll feio
            border: "none",
          },
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
          <Toolbar
            disableGutters
            sx={{
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              transition: "all 0.3s ease",
              cursor: "pointer",
              minHeight: 64,
            }}
            onClick={() => navigate("/dashboard")}
          >
            <Box
              component="img"
              src={collapsed ? logoIcon : logo}
              alt="Logo do App"
              sx={{
                height: collapsed ? 32 : 40,
                maxWidth: "100%",
                width: "auto",
                objectFit: "contain",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </Toolbar>

          {/* DASHBOARD */}
          <List
            subheader={
              !collapsed && (
                <ListSubheader
                  component="div"
                  disableSticky
                  sx={{
                    fontWeight: "bold",
                    letterSpacing: 1,
                    fontSize: 12,
                    color: theme.palette.text.secondary,
                    px: 2,
                    mb: 1,
                    textTransform: "uppercase",
                  }}
                >
                  DASHBOARD
                </ListSubheader>
              )
            }
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <Tooltip title={collapsed ? "Dashboard" : ""} placement="right">
                <ListItemButton
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    borderRadius: 2,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1.5 : 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      color: theme.palette.primary.main,
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                    }}
                  >
                    <WaterfallChartIcon />
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: "500", fontSize: 15 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>

          {/* VISÃO GERAL */}
          <List
            subheader={
              !collapsed && (
                <ListSubheader
                  component="div"
                  disableSticky
                  sx={{
                    fontWeight: "bold",
                    letterSpacing: 1,
                    fontSize: 12,
                    color: theme.palette.text.secondary,
                    px: 2,
                    mb: 1,
                    textTransform: "uppercase",
                  }}
                >
                  VISÃO GERAL
                </ListSubheader>
              )
            }
          >
            {menuItemsTop.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <Tooltip title={collapsed ? item.text : ""} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      justifyContent: collapsed ? "center" : "flex-start",
                      px: collapsed ? 1.5 : 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                        color: theme.palette.primary.main,
                        "& .MuiListItemIcon-root": {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 0,
                        mr: collapsed ? 0 : 2,
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: "500", fontSize: 15 }} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>

          {/* CLIENTES */}
          <List
            subheader={
              !collapsed && (
                <ListSubheader
                  component="div"
                  disableSticky
                  sx={{
                    fontWeight: "bold",
                    letterSpacing: 1,
                    fontSize: 12,
                    color: theme.palette.text.secondary,
                    px: 2,
                    mb: 1,
                    textTransform: "uppercase",
                  }}
                >
                  CLIENTES
                </ListSubheader>
              )
            }
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <Tooltip title={collapsed ? "Clientes" : ""} placement="right">
                <ListItemButton
                  onClick={() => navigate("/users")}
                  sx={{
                    borderRadius: 2,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1.5 : 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      color: theme.palette.primary.main,
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                    }}
                  >
                    <PersonOutlinedIcon />
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary="Clientes" primaryTypographyProps={{ fontWeight: "500", fontSize: 15 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
        </Box>

        {/* Rodapé: Botões Configurações, toggle tema e toggle sidebar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", px: 1, flexDirection: "column", gap: 1, padding: 0 }}>
          {/* Configurações */}
          <Tooltip title={configItem.tooltip}>
            <IconButton
              color="inherit"
              onClick={() => navigate(configItem.path)}
              size="large"
              sx={{
                borderRadius: 2,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
              }}
            >
              {configItem.icon}
            </IconButton>
          </Tooltip>

          {/* Toggle sidebar */}
          <Tooltip title={collapsed ? "Expandir menu" : "Recolher menu"}>
            <IconButton
              color="inherit"
              onClick={() => setCollapsed(!collapsed)}
              size="large"
              sx={{
                borderRadius: 2,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
              }}
            >
              {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: theme.palette.background.default,
          overflow: "auto",
          minHeight: "100vh",
          width: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          // ml: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
        }}
      >
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
            ml: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
            bgcolor: theme.palette.background.paper,
            borderRadius: "0 0 24px 0px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            transition: "width 0.3s ease, margin-left 0.3s ease",
            // borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Toggle tema */}
              <Tooltip title={darkMode ? "Modo Claro" : "Modo Escuro"}>
                <IconButton
                  color="inherit"
                  onClick={toggleDarkMode}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    height: 45,
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {darkMode ? (
                    <LightModeIcon sx={{ color: "#fdd835" }} /> // amarelo claro
                  ) : (
                    <DarkModeIcon sx={{ color: "#90caf9" }} /> // azul claro
                  )}
                </IconButton>
              </Tooltip>

              <Box
                sx={{
                  p: 1,
                  ml: 3,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 10,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Avatar
                  alt={user?.name}
                  src={avatarFilename ? `${baseUrl}/api/user/proxy/avatar/${avatarFilename}` : undefined}
                  sx={{
                    width: 35,
                    height: 35,
                    cursor: "pointer",
                    transition: "0.2s ease",
                    "&:hover": {
                      boxShadow: `0 0 0 3px ${theme.palette.primary.main}`,
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => navigate("/settings")}
                />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Toolbar />
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            p: 2,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
