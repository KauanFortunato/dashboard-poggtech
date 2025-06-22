import React from "react";
import { Typography, Box } from "@mui/material";
import ProductTable from "../components/ProductsTable";

function ProductsPage({ currentUser }) {
  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom>
        Lista de Produtos
      </Typography>

      <ProductTable currentUser={currentUser} />
    </Box>
  );
}

export default ProductsPage;
