import React from "react";
import { MainAppBar, SideDrawer } from "./components/navigations";
import {
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import { DrawingContainer } from "./features/chemDraw/DrawingContainer";
import moment from "moment-timezone";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => {
  return {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  };
});

function App() {
  const uploadTime = moment("2024-05-21T21:51:59.649").toISOString();
  console.log("upload time:", uploadTime);
  const tz = moment.tz.guess();
  const start = moment.tz("2024-05-21T21:51:59.649Z", tz);
  const now = moment();

  console.log("diff===========", now.diff(start, "hours"));
  console.log("----tz--", tz);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <MainAppBar drawerOpenHandler={toggleDrawer} />
      <SideDrawer open={openDrawer} toggleDrawer={toggleDrawer} />
      <Main>
        <DrawingContainer />
      </Main>
    </ThemeProvider>
  );
}

export default App;
