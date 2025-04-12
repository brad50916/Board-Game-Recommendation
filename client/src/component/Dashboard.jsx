import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SecondaryListItems from "./listItems.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken, getGameId } from "./Api.jsx";
import BoardGameGrid from "./Boardgamegrid.jsx"
import GamePreferencePage from "./gamepreference.jsx";
import GameInfoPage from "./GameInfo.jsx";
import GameSearchPage from "./SearchGame.jsx";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#333333",
    },
  },
});

export default function Dashboard() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [gameId, setGameId] = useState(null);

  const [openDash, setOpenDash] = useState(true);
  const [openPref, setOpenPref] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openGameInfo, setopenGameInfo] = useState(false);

  const [currentIsDashboard, setCurrentIsDashboard] = useState(true);

  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameClick = (gameId) => {
    setSelectedGame(gameId);
    handleClickGameInfo();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const result = await verifyToken(token);
          if (result) {
            setUserId(result);
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchGameId = async () => {
      try {
        const result = await getGameId(userId);
        if (result) {
          setGameId(result);
        } 
      } catch (error) {
        console.error("Error fetching game ID:", error);
      }
    };
    fetchGameId();
  }, []);


  const handleClickSearch = () => {
    setOpenDash(false);
    setOpenPref(false);
    setOpenSearch(true);
    setopenGameInfo(false);
    setCurrentIsDashboard(false);
  };

  const handleClickDashboard = () => {
    setOpenDash(true);
    setOpenPref(false);
    setOpenSearch(false);
    setopenGameInfo(false);
    setCurrentIsDashboard(true);
  };

  const handleClickPref = () => {
    setOpenDash(false);
    setOpenPref(true);
    setOpenSearch(false);
    setopenGameInfo(false);
  }

  const handleClickGameInfo = () => {
    setOpenDash(false);
    setOpenPref(false);
    setOpenSearch(false);
    setopenGameInfo(true);
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Recommend Board Game
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          {/* <Divider /> */}
          <List component="nav">
            {/* <MainListItems
              chatRoomData={chatRoomData}
              UserId={UserId}
              setCurrentChatId={setCurrentChatId}
              setChatReloadTrigger={setChatReloadTrigger}
            /> */}
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems onClickHandler1={logout} onClickHandler2={handleClickSearch} 
            onClickHandler3={handleClickDashboard} onClickHandler4={handleClickPref}/>
          </List>
        </Drawer>
        <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 10,
            }}
          >
            {openDash && (
              <BoardGameGrid gameId={gameId} onGameClick={handleGameClick}></BoardGameGrid>
            )}
            {openPref && (
              <GamePreferencePage></GamePreferencePage>
            )}
            {openSearch && (
              <GameSearchPage handleGameClick={handleGameClick}></GameSearchPage>
            )}
            {openGameInfo && currentIsDashboard && (
              <GameInfoPage gameId={selectedGame} onExit={handleClickDashboard} userId={userId}></GameInfoPage>
            )}
            {openGameInfo && !currentIsDashboard && (
              <GameInfoPage gameId={selectedGame} onExit={handleClickSearch} userId={userId}></GameInfoPage>
            )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
