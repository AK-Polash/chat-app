import React from "react";
import Grid from "@mui/material/Grid";
import GroupList from "../../components/GroupList";
import Friends from "../../components/Friends";
import UserList from "../../components/UserList";
import FriendRequest from "../../components/FriendRequest";
import MyGroups from "../../components/MyGroups";
import BlockList from "../../components/BlockList";
import "./home.css";

const Home = () => {
  return (
    <div className="main__home">
      <Grid container spacing={3} sx={{ height: "100%" }}>
        <Grid item xs={4}>
          <GroupList />
        </Grid>
        <Grid item xs={4}>
          <Friends />
        </Grid>
        <Grid item xs={4}>
          <UserList />
        </Grid>
        <Grid item xs={4}>
          <FriendRequest />
        </Grid>
        <Grid item xs={4}>
          <MyGroups />
        </Grid>
        <Grid item xs={4}>
          <BlockList />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
