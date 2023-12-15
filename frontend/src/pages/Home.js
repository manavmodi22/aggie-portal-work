import React from "react";
import Navbar from "../component/Navbar";
import Search from "../component/Search";
import Footer from "../component/Footer";

const Home = () => {
  return (
    <div
      style={{ backgroundColor: "#500001", minHeight: "100vh", color: "white" }}
    >
      <Navbar />
      <div
        style={{
          paddingTop: "64px",
          paddingBottom: "100px",
        }}
      >
        <Search />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
