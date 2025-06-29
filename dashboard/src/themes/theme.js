// src/themes/theme.js
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#1565C0", light: "#1E88E5", contrastText: "#FFFFFF" },
        secondary: { main: "#90CAF9", light: "#BBDEFB", contrastText: "#000000" },
        background: { default: "#202222", paper: "#181a1b" },
        text: { primary: "#FFFFFF", secondary: "#CCCCCC" },
        divider: "#555555",
        error: { main: "#FF6B6B", contrastText: "#000000" },
        success: { main: "#81C784", contrastText: "#000000" },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#0D0D0D",
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
        secondary: { main: "#64B5F6", light: "#E3F2FD", contrastText: "#000000" },
        background: { default: "#F9F9F9", paper: "#FFFFFF" },
        text: { primary: "#212121", secondary: "#444444" },
        divider: "#CCCCCC",
        error: { main: "#E53935", contrastText: "#FFFFFF" },
        success: { main: "#43A047", contrastText: "#FFFFFF" },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#F9F9F9",
                    color: "#212121",
                },
            },
        },
    },
});
