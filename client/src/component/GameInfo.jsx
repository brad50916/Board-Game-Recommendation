import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Rating, 
  Button, 
  Divider,
  Card,
  CardMedia,
  IconButton
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  Group as PlayersIcon,
  Star as StarIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getGameInfo, getUserGameRating, setUserGameRating} from "./Api.jsx";
import { use } from 'react';

const GameInfoPage = ({ gameId, onExit, userId }) => {
  const [game, setBoardGames] = useState(null);

  useEffect(() => {
    if (gameId) {
      const fetchGameInfo = async () => {
        try {
          const gameInfo = await getGameInfo(gameId);
          if (gameInfo) {
            const gameData = {
              id: gameInfo.bggid,
              title: gameInfo.name,
              description: gameInfo.description,
              year: gameInfo.yearpublished,
              averageRating: gameInfo.avgrating / 2,
              players: `${gameInfo.minplayers}-${gameInfo.maxplayers}`,
              totalRatings: gameInfo.numuserratings,
              image: gameInfo.imagepath,
            };
            setBoardGames(gameData);
          } else {
            console.error(`Game info not found for ID ${gameId}`);
          }
        } catch (error) {
          console.error('Error fetching game info:', error);
        }
      };

      fetchGameInfo();
    }
  }, [gameId]);

  // State for user's rating
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);


  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const rate = await getUserGameRating(userId, gameId);
        if (rate) {
          setUserRating(rate.rating);
          setHasRated(true);
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };
    fetchUserRating();
  }, []);

  // Handle rating change
  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
  };

  // Handle rating submission
  const handleSubmitRating = () => {
    if (userRating > 0) {
      setHasRated(true);
      try {
        setUserGameRating(userId, gameId, userRating);
      }
      catch (error) {
        console.error('Error submitting rating:', error);
      }
    }
  };

  return (
    game ? (
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 3, mt: 4, mb: 4, position: 'relative',}}>
          <IconButton
            onClick={onExit}
            sx={{
              position: 'absolute',
              top: 10, // Adjusted to align with the top corner of the Paper
              right: 10, // Adjusted to align with the right corner of the Paper
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '2px solid rgba(0, 0, 0, 0.2)', // Solid contour
              borderRadius: '50%', // Optional: to match the circular shape of the button
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '2px solid rgba(0, 0, 0, 0.4)', // Darker border on hover
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid container spacing={4}>
            {/* Game image */}
            <Grid item xs={12} md={5}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  image={game.image}
                  alt={game.title}
                  sx={{ height: '100%', objectFit: 'cover' }}
                />
              </Card>
            </Grid>
            
            {/* Game details */}
            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                {game.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ color: 'gold', mr: 0.5 }} />
                  <Typography variant="h6" component="span">
                    {game.averageRating.toFixed(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({game.totalRatings.toLocaleString()} ratings)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {game.year}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PlayersIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {game.players} players
                  </Typography>
                </Box>
                
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" paragraph>
                  {game.description}
                </Typography>
              </Box>
              
              {/* <Box sx={{ mb: 4 }}>
                {game.categories.map((category) => (
                  <Chip 
                    key={category} 
                    label={category} 
                    variant="outlined" 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box> */}
              
              <Divider sx={{ mb: 3 }} />
              
              {/* Rating section */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  {hasRated ? 'Your Rating' : 'Rate This Game'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating 
                    name="game-rating" 
                    value={userRating} 
                    onChange={handleRatingChange}
                    precision={1}
                    size="large"
                    disabled={hasRated}
                  />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {userRating > 0 ? `${userRating.toFixed(1)} stars` : 'Not rated yet'}
                  </Typography>
                </Box>
                
                {!hasRated && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    disabled={userRating === 0}
                    onClick={handleSubmitRating}
                  >
                    Submit Rating
                  </Button>
                )}
                
                {hasRated && (
                  <Typography variant="body2" color="success.main">
                    Thanks for rating this game!
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    ) : (
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 3, mt: 4, mb: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Loading game information...
          </Typography>
        </Paper>
      </Container>
    )
  );
};

export default GameInfoPage;