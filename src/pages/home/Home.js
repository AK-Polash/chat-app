import React from "react";
import Grid from "@mui/material/Grid";
import "./home.css";
import SectionItem from "../../components/SectionItem";
import {
  groupList,
  friends,
  userList,
  friendRequest,
  myGroups,
  blockList,
} from "../../data/data";

const Home = () => {
  return (
    <div className="main__home">
      <Grid container spacing={3} sx={{ height: "100%" }}>
        <Grid item xs={4}>
          <SectionItem
            button={true}
            data={groupList}
            sectionHeadingTitle="Group List"
          />
        </Grid>
        <Grid item xs={4}>
          <SectionItem
            button={false}
            data={friends}
            sectionHeadingTitle="Friends"
          />
        </Grid>
        <Grid item xs={4}>
          <SectionItem
            button={true}
            data={userList}
            sectionHeadingTitle="User List"
          />
        </Grid>
        <Grid item xs={4}>
          <SectionItem
            button={true}
            data={friendRequest}
            sectionHeadingTitle="Friend Request"
          />
        </Grid>
        <Grid item xs={4}>
          <SectionItem
            button={false}
            data={myGroups}
            sectionHeadingTitle="My Groups"
          />
        </Grid>
        <Grid item xs={4}>
          <SectionItem
            button={true}
            data={blockList}
            sectionHeadingTitle="Block List"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
