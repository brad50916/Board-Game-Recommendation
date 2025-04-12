import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";

export default function ViewProfile({
  startChat,
  open,
  handleClose,
  selectedUser,
  handleChat,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      TransitionComponent={Fade}
      maxWidth="sm" // optional, adjust as per your design
      fullWidth // optional, adjust as per your design
    >
      <Box sx={{ p: 4 }}>
        {selectedUser && (
          <>
            <DialogTitle id="transition-modal-title">User Info</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Username: {selectedUser.username}
              </Typography>
              <Typography variant="body1">
                Email: {selectedUser.email}
              </Typography>
              {/* Add more user details as needed */}
            </DialogContent>
            <DialogActions>
              {startChat && (
                <Button onClick={handleChat} color="primary">
                  Start chatting
                </Button>
              )}
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Box>
    </Dialog>
  );
}
