import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";

export default function NoPage() {
  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={10}>
        <Typography variant="h1" component="h2" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for does not exist. Please check the URL or
          return to the homepage.
        </Typography>
        <Button variant="contained" color="primary" component={RouterLink} to="/">
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
}
