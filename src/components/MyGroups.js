import React from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import Grid from "@mui/material/Grid";

const MyGroups = () => {
  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="My Groups" />

        <Lists>
          <ListItem
            imageAs="small"
            heading="Asif Khan"
            textAs="hi..!"
            buttonText="Today, 8pm"
          />
        </Lists>
      </section>
    </Grid>
  );
};

export default MyGroups;
