import { Alert } from "@mui/material";
import React from "react";
/**
 * ErrorAlert component renders an error message using Material-UI's Alert component.
 * @param {string} error - The error message to be displayed.
 * Displays an Alert with an error severity when an error is present.
 */
const ErrorAlert = ({ error }) => {
  return (
    error && (
      <Alert variant="filled" severity="error">
        {error}
      </Alert>
    )
  );
};

export default ErrorAlert;
