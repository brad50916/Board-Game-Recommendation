import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modify from "./Modify.jsx";
import Avatar from "./Avatar.jsx";
import { verifyToken, getAvatar } from "./Api.jsx";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [openModify, setOpenModify] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const result = await verifyToken(token);
          if (!result) {
            navigate("/");
          }
        } catch (error) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user) {
        try {
          const result = await getAvatar(user.id);
          if (result) {
            setAvatarUrl(result);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        }
      }
    };

    fetchAvatar();
  }, [user]);

  const handleModifyOpen = () => {
    setOpenModify(true);
  };

  const handleModifyClose = () => {
    setOpenModify(false);
  };

  const handleAvatarOpen = () => {
    setOpenAvatar(true);
  };

  const handleAvatarClose = () => {
    setOpenAvatar(false);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {user && (
        <>
          {avatarUrl && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "center", // Centers horizontally in case of small screens
              }}
            >
              <Box
                sx={{
                  width: 250, // Diameter of the circle
                  height: 250, // Diameter of the circle
                  borderRadius: "50%", // Makes the container circular
                  overflow: "hidden", // Hides any overflowed parts of the image
                  display: "flex", // Enables flexbox layout
                  justifyContent: "center", // Centers the image horizontally
                  alignItems: "center", // Centers the image vertically
                  mr: 2, // Margin-right to space out the image from the text
                }}
              >
                <Box
                  component="img"
                  src={avatarUrl}
                  alt="User Avatar"
                  sx={{
                    width: "100%", // Image width to fit the container
                    height: "auto", // Maintain aspect ratio
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body1">
                  <strong>First Name:</strong> {user.firstname}
                </Typography>
                <Typography variant="body1">
                  <strong>Last Name:</strong> {user.lastname}
                </Typography>
                <Typography variant="body1">
                  <strong>Username:</strong> {user.username}
                </Typography>
              </Box>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/dashboard")}
            sx={{ mt: 2, mr: 2 }}
          >
            Dashboard
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleModifyOpen}
            sx={{ mt: 2 }}
          >
            Modify
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAvatarOpen}
            sx={{ mt: 2, ml: 2 }}
          >
            Upload Avatar
          </Button>
        </>
      )}
      <Dialog
        open={openModify}
        onClose={handleModifyClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <Modify onClose={handleModifyClose} user={user} setUser={setUser} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openAvatar}
        onClose={handleAvatarClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <Avatar onClose={handleAvatarClose} user={user} setUser={setUser} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Profile;
