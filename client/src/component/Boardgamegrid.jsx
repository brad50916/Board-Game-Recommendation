import { Card, CardMedia, Typography, Grid, Box, Rating } from '@mui/material';
import { getGameInfo } from "./Api.jsx";
import { useEffect, useState } from 'react';

const BoardGameGrid = ({gameId, onGameClick}) => {

  const [boardGames, setBoardGames] = useState([]);

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

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Grid container spacing={2}>
        {boardGames.map((game, index) => (
          <Grid item xs={6} md={3} key={game.id}>
            <Card 
              sx={{
                position: 'relative',
                height: '240px',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover effects
                '&:hover': {
                  transform: 'scale(1.05)', // Slightly enlarge the card on hover
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Add a shadow effect on hover
                },
              }}
              >
              <CardMedia
                component="img"
                height="240"
                image={game.imagepath}
                alt={game.title}
                sx={{ filter: 'brightness(0.7)' }}
                onClick={() => onGameClick(game.id)} 
              />
              
              {/* Ranking Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'green',
                  color: 'white',
                  borderRadius: '50%',
                  width: 45,
                  height: 45,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  padding: '5px'
                }}
              >
                <Typography variant="caption" fontWeight="bold" fontSize="0.9rem">
                  #{index + 1}
                </Typography>
                {/* <Typography variant="caption" fontSize="0.7rem">
                  ({game.score})
                </Typography> */}
              </Box>
              
              {/* Rating Stars */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 60,
                  right: 10,
                }}
              >
                <Rating 
                  value={game.rating} 
                  precision={0.1} 
                  readOnly 
                  size="small"
                  sx={{ color: 'white' }}
                />
              </Box>
              
              {/* Game Title and Year */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 2,
                  color: 'white',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                  paddingTop: 4
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                  {game.title}
                </Typography>
                <Typography variant="body2" component="span" sx={{ opacity: 0.8 }}>
                  ({game.year})
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BoardGameGrid;