import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1D5758",
      dark: "#164546",
      light: "#3E8A8B",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2BD1C7",
      dark: "#1A9E96",
      contrastText: "#0F3536",
    },
  },
  typography: {
    fontFamily: "var(--font-inter)",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundImage: "linear-gradient(96deg, #1D5758 0%, #2BD1C7 100%)",
          boxShadow: "none",
          "&:hover": {
            backgroundImage: "linear-gradient(96deg, #164546 0%, #1A9E96 100%)",
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
