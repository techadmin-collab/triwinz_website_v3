import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5014D2",
      dark: "#4310b3",
      light: "#7a3df0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#DD3CA7",
      dark: "#c43393",
      contrastText: "#fff",
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
          backgroundImage: "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
          boxShadow: "none",
          "&:hover": {
            backgroundImage: "linear-gradient(96deg, #4310b3 0%, #c43393 100%)",
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
