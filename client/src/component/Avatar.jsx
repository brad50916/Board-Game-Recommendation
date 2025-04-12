import { Box, Button, Typography, Input } from "@mui/material";
import { useEffect, useState } from "react";
import { uploadAvatar } from "./Api.jsx";
const Avatar = ({ onClose, user, setUser }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const result = await uploadAvatar(file, user.id);
        if (result) {
          localStorage.setItem("user", JSON.stringify(result));
          setUser(result);
          onClose();
        } else {
          console.error("Error uploading file");
        }
      } catch (error) {
        console.error("Error uploading file", error);
      }
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Modify Avatar
      </Typography>

      <form onSubmit={handleUpload}>
        <Input
          type="file"
          accept="image/*"
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2, mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </form>
    </Box>
  );
};

export default Avatar;
