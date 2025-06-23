import React from "react";
import { Typography, Box } from "@mui/material";
import CategoriesTable from "../components/CategoriesTable";

function Category({ currentUser }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Lista de categorias
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Visualize e gerencie as categorias de produtos.
      </Typography>

      <CategoriesTable currentUser={currentUser} />
    </Box>
  );
}

export default Category;
