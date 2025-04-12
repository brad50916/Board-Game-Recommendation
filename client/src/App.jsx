import Dashboard from "./component/Dashboard";
import Signup from "./component/Signup";
import Signin from "./component/Signin";
import NoPage from "./component/NoPage";
import Profile from "./component/Profile";
import Modify from "./component/Modify";
import GamePreferencePage from "./component/gamepreference";
import BoardGameGrid from "./component/Boardgamegrid_initial";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preference" element={<GamePreferencePage />} />
        <Route path="/boardgamegrid" element={<BoardGameGrid />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/modify" element={<Modify />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
