import { Stack } from "@mui/material";
import React from "react";
import FindUsers from "../FindUsers";
import TopPosts from "../TopPosts";

/**
 * Sidebar Component: This component represents a sidebar structure using Material-UI's Stack component.
 * It combines the TopPosts and FindUsers components with specified spacing between them.
 */
const Sidebar = () => {
  return (
    <>
      <Stack spacing={2}>
        <TopPosts />
        <FindUsers />
      </Stack>
    </>
  );
};

export default Sidebar;
