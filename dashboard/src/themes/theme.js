// src/themes/theme.js
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1565C0", light: "#1E88E5", contrastText: "#FFFFFF" },
    secondary: { main: "#2196F3", light: "#1D1D1D", contrastText: "#FFFFFF" },
    background: { default: "#121212", paper: "#2A2A2A" },
    text: { primary: "#FFFFFF", secondary: "#E0E0E0" },
    divider: "#424242",
    error: { main: "#EF5350", contrastText: "#FFFFFF" },
    success: { main: "#66BB6A", contrastText: "#000000" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
          color: "#FFFFFF",
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565C0", light: "#2196F3", contrastText: "#FFFFFF" },
    secondary: { main: "#2196F3", light: "#F5F5F5", contrastText: "#000000" },
    background: { default: "#FFFFFF", paper: "#EEEEEE" },
    text: { primary: "#212121", secondary: "#666666" },
    divider: "#E0E0E0",
    error: { main: "#F44336", contrastText: "#FFFFFF" },
    success: { main: "#4CAF50", contrastText: "#FFFFFF" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#EEEEEE",
          color: "#212121",
        },
      },
    },
  },
});
