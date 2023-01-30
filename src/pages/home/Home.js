import React from "react";
import Grid from "@mui/material/Grid";
import GroupList from "../../components/GroupList";
import Friends from "../../components/Friends";
import UserList from "../../components/UserList";
import FriendRequest from "../../components/FriendRequest";
import MyGroups from "../../components/MyGroups";
import BlockList from "../../components/BlockList";
import { ToastContainer } from "react-toastify";
import "./home.css";

const Home = () => {
  return (
    <div className="main__home">
      <ToastContainer />
      <Grid container spacing={3} sx={{ height: "100%" }}>
        <GroupList />

        <Friends />

        <UserList />

        <FriendRequest />

        <MyGroups />

        <BlockList />
      </Grid>
    </div>
  );
};

export default Home;
