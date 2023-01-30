import React from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import Grid from "@mui/material/Grid";

const GroupList = () => {
  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="Group List" />

        <Lists>
          <ListItem
            imageAs="large"
            heading="Friends Forever"
            headingAs="h4"
            textAs="Hi all..!"
            button="button"
            buttonText="Add"
          />
          <ListItem
            imageAs="large"
            heading="Guitar BD"
            headingAs="h4"
            textAs="Hi all..!"
            button="button"
            buttonText="Add"
          />
          <ListItem
            imageAs="large"
            heading="Web Coders"
            headingAs="h4"
            textAs="Hi all..!"
            button="button"
            buttonText="Add"
          />
          <ListItem
            imageAs="large"
            heading="Photography"
            headingAs="h4"
            textAs="Hi all..!"
            button="button"
            buttonText="Add"
          />
        </Lists>
      </section>
    </Grid>
  );
};

export default GroupList;
