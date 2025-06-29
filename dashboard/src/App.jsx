import { useState, useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lightTheme, darkTheme } from "./themes/theme";
import LoginPage from "./pages/Login";
import { AuthContext } from "./contexts/AuthContext";
import { ThemeProvider } from "@mui/material";
import DashboardLayout from "./components/DashboardLayout";
import SettingsPage from "./pages/Settings";
import DashboardPage from "./pages/Dashboard";
import ProductsPage from "./pages/Products";
import UsersPage from "./pages/Users";
import PaymentsPage from "./pages/Payments";
import WalletsPage from "./pages/Wallets";
import OrdersPage from "./pages/Orders";
import CategoryPage from "./pages/Category";
import ReviewPage from "./pages/Review";

function App() {
  const { user } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "rgba(255,255,255,0.87)" : "#213547";
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        {!user ? (
          <LoginPage onLoginSuccess={(user) => console.log("Login successful:", user)} />
        ) : (
          <DashboardLayout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage currentUser={user} />} />
              <Route path="/products" element={<ProductsPage currentUser={user} />} />
              <Route path="/orders" element={<OrdersPage currentUser={user} />} />
              <Route path="/categories" element={<CategoryPage currentUser={user} />} />
              <Route path="/payments" element={<PaymentsPage currentUser={user} />} />
              <Route path="/reviews" element={<ReviewPage currentUser={user} />} />
              <Route path="/wallets" element={<WalletsPage currentUser={user} />} />
              <Route path="/settings" element={<SettingsPage currentUser={user} />} />
            </Routes>
          </DashboardLayout>
        )}
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
