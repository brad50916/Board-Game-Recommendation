import { Card, CardMedia, Typography, Grid, Box, Rating, Button } from '@mui/material';
import { getGameInfo, getGameIdFromPreference, setUserGameRating } from "./Api.jsx";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
const BoardGameGrid = () => {

  const [boardGames, setBoardGames] = useState([]);
  const [gameId, setGameId] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  useEffect(() => {
    const fetchGameId = async () => {
      try {
        const result = await getGameIdFromPreference(userId);
        if (result) {
          setGameId(result);
        } 
      } catch (error) {
        console.error("Error fetching game ID:", error);
      }
    };
    fetchGameId();
  }, []);

  useEffect(() => {
    const fetchGameInfo = async (gameIds) => {
      try {
        const allGames = [];

        for (let i = 0; i < gameIds.length; i++) {
          const gameInfo = await getGameInfo(gameIds[i]);

          if (gameInfo) {
            const gameData = {
              id: gameInfo.bggid,
              title: gameInfo.name,
              description: gameInfo.description,
              year: gameInfo.yearpublished,
              rating: Math.round((gameInfo.avgrating / 2) * 2) / 2,
              minplayers: gameInfo.minplayers,
              maxplayers: gameInfo.maxplayers,
              numuserratings: gameInfo.numuserratings,
              imagepath: gameInfo.imagepath,
            };

            allGames.push(gameData);
          } else {
            console.error(`Game info not found for ID ${gameIds[i]}`);
          }
        }

        setBoardGames(allGames);
      } catch (error) {
        console.error('Error fetching game info:', error);
      }
    };

    if (Array.isArray(gameId) && gameId.length > 0) {
      fetchGameInfo(gameId);
    }
  }, [gameId]);

  const navigate = useNavigate();
  const [userRatings, setUserRatings] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate("/dashboard");
  }

  const handleSubmitRating = async (gameId) => {
    const gameRating = userRatings[gameId]?.rating || 0;
  
    if (gameRating > 0) {
      try {
        // Example API call — replace with your real endpoint
        await setUserGameRating(userId, gameId, gameRating); 
  
        setUserRatings(prev => ({
          ...prev,
          [gameId]: {
            ...prev[gameId],
            hasRated: true
          }
        }));
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    }
  };
  
  const handleRatingChange = (gameId, newRating) => {
    setUserRatings(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        rating: newRating,
        hasRated: false
      }
    }));
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: 2 }}>
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          sx={{ px: 4, py: 2 }}
          onClick={handleSubmit}
        >
          Complete rating
        </Button>
      </Box>

      <Grid container spacing={4}>
        {boardGames.map((game, index) => {
          const gameRatingData = userRatings[game.id] || { rating: 0, hasRated: false };
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  backgroundColor: 'white',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={game.imagepath}
                  alt={game.title}
                  sx={{ objectFit: 'cover', filter: 'brightness(0.85)' }}
                />

                <Box sx={{ p: 2, flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {game.title} <span style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>({game.year})</span>
                  </Typography>

                  {/* <Rating
                    value={game.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{ color: 'primary.main', mb: 1 }}
                  /> */}

                  <Typography variant="body2" gutterBottom>
                    {gameRatingData.hasRated ? 'Your Rating' : 'Rate This Game'}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      name={`rating-${game.id}`}
                      value={gameRatingData.rating}
                      onChange={(_, newValue) => handleRatingChange(game.id, newValue)}
                      precision={1}
                      size="medium"
                      disabled={gameRatingData.hasRated}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {gameRatingData.rating > 0 ? `${gameRatingData.rating.toFixed(1)} stars` : ''}
                    </Typography>
                  </Box>

                  {!gameRatingData.hasRated && (
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      size="small"
                      disabled={gameRatingData.rating === 0}
                      onClick={() => handleSubmitRating(game.id)}
                    >
                      Submit Rating
                    </Button>
                  )}

                  {gameRatingData.hasRated && (
                    <Typography
                      variant="body2"
                      color="success.main"
                      align="center"
                      sx={{ mt: 1 }}
                    >
                      ✅ Thanks for rating!
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BoardGameGrid;