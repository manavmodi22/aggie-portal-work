import React from "react";
import { Box, Typography, Container, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#500001",
        color: "#FFF",
        padding: "20px 0",
        borderTop: "2px solid #FFF",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000, // to ensure footer stays on top
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" gutterBottom>
          &copy; 2023 Aggies In Tech
        </Typography>
        <Typography variant="body2" align="center">
          <Link
            color="inherit"
            href="#"
            underline="none"
            sx={{ marginRight: "10px" }}
          >
            Terms of Service
          </Link>
          |
          <Link
            color="inherit"
            href="#"
            underline="none"
            sx={{ marginLeft: "10px" }}
          >
            Privacy Policy
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
