import { CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";

/**
 * Loading component to display a circular progress indicator with an optional label.
 * Renders a CircularProgress component and an accompanying text label for loading state.
 * Props:
 * - label: Text to display below the loading indicator (defaults to "Loading" if not provided)
 * Usage:
 * <Loading label="Fetching data" />
 */
const Loading = ({ label }) => {
  return (
    <Stack alignItems="center">
      <CircularProgress size={50} sx={{ my: 1 }} />
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {label || "Loading"}
      </Typography>
    </Stack>
  );
};

export default Loading;
