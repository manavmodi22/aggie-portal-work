import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios"; // Import axios for making API requests
import { Snackbar, Alert } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const apiUrl = `http://localhost:9000/api/login`;
      const config = {
        method: "post",
        url: apiUrl,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: email,
          password: password,
        },
      };
      console.log(apiResponse)
      const apiResponse = await axios.request(config);
      const responseData = apiResponse.data;
      const token = responseData.token;
      const role = responseData.user.role;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      window.location.href = "/home";
    } catch (error) {
      console.error("Authentication failed:", error);
      setErrorMessage(
        error.response && error.response.data
          ? error.response.data.message
          : "Login failed. Please try again."
      );
      setOpenSnackbar(true);
    }
  };
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#500001",
          padding: "10px", // Added padding for mobile responsiveness
        }}
      >
        <Typography
          variant="h4"
          style={{
            marginBottom: "20px", // Adjusted for better spacing on mobile
            color: "white",
            fontFamily: "Crimson Pro",
          }}
        >
          Aggies In Tech
        </Typography>
        <div
          style={{
            maxWidth: "90%", // Ensures the container does not exceed the screen width on mobile
            width: "530px",
            minHeight: "203px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px", // Adjusted padding for mobile
            borderRadius: "5px",
          }}
        >
          <TextField
            fullWidth // Ensures the input takes up the container width
            margin="normal"
            placeholder="Email Address"
            name="email"
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth // Ensures the input takes up the container width
            margin="normal"
            placeholder="Password"
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth // Ensures the button takes up the container width
            style={{
              marginTop: "20px", // Added margin top for spacing
              backgroundColor: "#500001",
              color: "white",
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
