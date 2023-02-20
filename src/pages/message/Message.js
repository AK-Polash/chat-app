import React from "react";
import MyGroups from "../../components/MyGroups";
import Friends from "../../components/Friends";
import { Box, Grid } from "@mui/material";
import "./message.css";

const Message = () => {
  return (
    <>
      <Grid container columnSpacing={2} sx={{ background: "green" }}>
        <Grid item xs={4.4}>
          <MyGroups />
          <br />
          <Friends />
        </Grid>

        <Grid item xs={7.6}>
          <div>kire</div>
        </Grid>
      </Grid>
    </>
  );
};

export default Message;
