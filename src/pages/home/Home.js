import React from "react";
import Grid from "@mui/material/Grid";
import "./home.css";

const Home = () => {
  return (
    <div className="main__home">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <h2>Group List</h2>
          <h2>Friend Request</h2>
        </Grid>
        <Grid item xs={3}>
          <h2>Friends</h2>
          <h2>My Groups</h2>
        </Grid>
        <Grid item xs={3}>
          <h2>User List</h2>
          <h2>Blocked User</h2>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
