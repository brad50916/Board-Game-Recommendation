import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { searchGame } from "./Api.jsx";
import BoardGameGrid from "./Boardgamegrid.jsx"

const GameSearchPage = ({handleGameClick}) => {

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [gameId, setGameId] = useState(null);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search button click
  useEffect(() => {
      const fetchGames = async () => {
        try {
          const result = await searchGame(searchTerm);
          if (result) {
            setGameId(result);
          }
        } catch (error) {
          console.error("Error fetching games:", error);
        }
      };
      if (searchTerm) {
        fetchGames();
      }
    }, [searchTerm]);


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Find Board Games
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search for games..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            // onKeyDown={(event) => {
            //   if (event.key === 'Enter') {
            //     handleSearchClick();
            //   }
            // }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')}>
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>
      
      {/* Results count */}
      {/* <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          {gameId ? gameId.length : 0 } games found
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box> */}
      
      {/* Game Results */}
      {searchTerm && gameId && gameId.length > 0 && (
        <BoardGameGrid gameId={gameId} onGameClick={handleGameClick}></BoardGameGrid>
      )}
      
      {!searchTerm && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" gutterBottom>
            No games match your search
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default GameSearchPage;