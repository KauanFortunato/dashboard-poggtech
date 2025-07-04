import React from "react";
import { Typography, Box } from "@mui/material";
import ProductTable from "../components/ProductsTable";

function ProductsPage({ currentUser }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Lista de produtos
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Visualize e gerencie os produtos.
      </Typography>

      <ProductTable currentUser={currentUser} />
    </Box>
  );
}

export default ProductsPage;
