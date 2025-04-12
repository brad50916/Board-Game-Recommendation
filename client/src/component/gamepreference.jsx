import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Checkbox, 
  FormGroup, 
  FormControlLabel, 
  Container, 
  Paper, 
  Button, 
  Grid,
  Divider
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import {setGamePreference} from "./Api.jsx";


const GamePreferencePage = () => {
  // State to track selected preferences
  const [preferences, setPreferences] = useState({
    fantasyMyth: false,
    sciFiFuturism: false,
    ancientHistory: false,
    americanHistory: false,
    modernWars: false,
    crimeMystery: false,
    horrorSupernatural: false,
    adventureExploration: false,
    natureEnvironment: false,
    transportationVehicles: false,
    entertainmentPopCulture: false,
    literatureBooks: false,
    economicsIndustry: false,
    urbanLifeProfessions: false,
    historicalFictionAltHistory: false,
    loveRelationships: false,
    humorLighthearted: false,
    gamesPuzzles: false,
    artsCulture: false,
    charactersCombat: false,
  });
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user")).id;

  // Handle checkbox changes
  const handleChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await setGamePreference(userId, preferences);
    }
    catch (error) {
      console.error("Error setting game preferences:", error);
    }
    navigate("/boardgamegrid");
  }

  // Count selected preferences
  const selectedCount = Object.values(preferences).filter(Boolean).length;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Select Your Game Preferences
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Choose the game types you enjoy to get personalized recommendations
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Selected: <strong>{selectedCount}</strong> preferences
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={preferences.fantasyMyth} onChange={handleChange} name="fantasyMyth" />}
                label="Fantasy & Myth"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.sciFiFuturism} onChange={handleChange} name="sciFiFuturism" />}
                label="Science Fiction & Futurism"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.ancientHistory} onChange={handleChange} name="ancientHistory" />}
                label="History: Ancient to Early Modern"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.americanHistory} onChange={handleChange} name="americanHistory" />}
                label="American History"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.modernWars} onChange={handleChange} name="modernWars" />}
                label="Modern & 20th Century Wars"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.crimeMystery} onChange={handleChange} name="crimeMystery" />}
                label="Crime & Mystery"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.horrorSupernatural} onChange={handleChange} name="horrorSupernatural" />}
                label="Horror & Supernatural"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.adventureExploration} onChange={handleChange} name="adventureExploration" />}
                label="Adventure & Exploration"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.natureEnvironment} onChange={handleChange} name="natureEnvironment" />}
                label="Nature & Environment"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.transportationVehicles} onChange={handleChange} name="transportationVehicles" />}
                label="Transportation & Vehicles"
              />
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={preferences.entertainmentPopCulture} onChange={handleChange} name="entertainmentPopCulture" />}
                label="Entertainment & Pop Culture"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.literatureBooks} onChange={handleChange} name="literatureBooks" />}
                label="Literature & Books"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.economicsIndustry} onChange={handleChange} name="economicsIndustry" />}
                label="Economics & Industry"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.urbanLifeProfessions} onChange={handleChange} name="urbanLifeProfessions" />}
                label="Urban Life & Professions"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.historicalFictionAltHistory} onChange={handleChange} name="historicalFictionAltHistory" />}
                label="Historical Fiction & Alternate History"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.loveRelationships} onChange={handleChange} name="loveRelationships" />}
                label="Love & Relationships"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.humorLighthearted} onChange={handleChange} name="humorLighthearted" />}
                label="Humor & Lighthearted Themes"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.gamesPuzzles} onChange={handleChange} name="gamesPuzzles" />}
                label="Games & Puzzles"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.artsCulture} onChange={handleChange} name="artsCulture" />}
                label="Arts & Culture"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.charactersCombat} onChange={handleChange} name="charactersCombat" />}
                label="Miscellaneous / Other Characters & Combat"
              />
            </FormGroup>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={selectedCount === 0}
            sx={{ px: 4, py: 1.5 }}
            onClick={handleSubmit}
          >
            Find Games
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default GamePreferencePage;