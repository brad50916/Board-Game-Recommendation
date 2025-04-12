import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from '@mui/icons-material/Logout';
import Person2Icon from '@mui/icons-material/Person2';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

import { useNavigate } from "react-router-dom";


export default function SecondaryListItems({ onClickHandler1, onClickHandler2, onClickHandler3, onClickHandler4 }) {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      {/* <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader> */}
      <ListItemButton onClick={onClickHandler3}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={onClickHandler2}>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <ListItemText primary="Search" />
      </ListItemButton>
      <ListItemButton onClick={onClickHandler4}>
        <ListItemIcon>
          <TuneIcon />
        </ListItemIcon>
        <ListItemText primary="Preference" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/profile")}>
        <ListItemIcon>
          <Person2Icon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton onClick={onClickHandler1}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
}
