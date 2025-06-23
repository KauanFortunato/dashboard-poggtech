import React from "react";
import { Typography, Box } from "@mui/material";
import ReviewTable from "../components/ReviewTable";

function ReviewPage({ currentUser }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Lista de reviews
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Visualize e gerencie as reviews.
      </Typography>

      <ReviewTable currentUser={currentUser} />
    </Box>
  );
}

export default ReviewPage;
