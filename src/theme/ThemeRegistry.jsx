"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Toaster } from "react-hot-toast";
import theme from "./theme";

export default function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Toaster position="top-center" />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
