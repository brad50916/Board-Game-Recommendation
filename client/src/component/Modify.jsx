import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { modifyUserInfo } from "./Api.jsx";

const Modify = ({ onClose, user, setUser }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await modifyUserInfo(formData);
      if (result) {
        localStorage.setItem("user", JSON.stringify(result));
        setUser(result);
        onClose(); // Close the dialog on successful submit
      } else {
        console.error("Error modifying user info");
      }
    } catch (error) {
      console.error("Error modifying user info:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Modify Profile
      </Typography>
      {formData && (
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
      )}
    </Box>
  );
};

export default Modify;