import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import categoryRoutes from "./routes/Category.js";
import reviewRoutes from "./routes/Review.js";
import walletRoutes from "./routes/Wallet.js";
import orderRoutes from "./routes/Order.js";
import productRoutes from "./routes/Product.js";
import userRoutes from "./routes/User.js";
import firebaseService from "./routes/Firebase.js";
import dashboardService from "./routes/Dashboard.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/category", categoryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/firebase", firebaseService);
app.use("/api/dashboard", dashboardService);

app.listen(3001, () => {
  console.log("Proxy rodando em http://localhost:3001");
});
