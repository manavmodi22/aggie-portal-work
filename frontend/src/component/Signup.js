import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate(); // 2. Initialize the useNavigate hook

  const handleSignup = async () => {
    try {
      const config = {
        method: "post",
        url: `http://localhost:9000/api/signup`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        },
      };

      const apiResponse = await axios.request(config);
      console.log(apiResponse);
      // Handle success response
      //navigate("/code-verify", { state: { userEmail: email } });
    } catch (error) {
      // Handle registration error
      console.error("Registration failed:", error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#500001",
        }}
      >
        <Typography
          variant="h4"
          style={{
            marginBottom: "50px",
            color: "white",
            fontFamily: "Crimson Pro",
          }}
        >
          Aggies In Tech
        </Typography>
        <div
          style={{
            width: "530px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "30px",
            borderRadius: "5px",
          }}
        >
          <TextField
            style={{ width: "390px", height: "50px", marginBottom: "20px" }}
            placeholder="First Name"
            name="firstName"
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            style={{ width: "390px", height: "50px", marginBottom: "20px" }}
            placeholder="Last Name"
            name="lastName"
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            style={{ width: "390px", height: "50px", marginBottom: "20px" }}
            placeholder="Email Address"
            name="email"
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            style={{ width: "390px", height: "50px", marginBottom: "20px" }}
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
            style={{
              width: "400px",
              height: "60px",
              backgroundColor: "#500001",
              color: "white",
              borderRadius: "5px",
            }}
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </>
  );
};

export default Register;
