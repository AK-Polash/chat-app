import React from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import Grid from "@mui/material/Grid";

const BlockList = () => {
  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="Block List" />

        <Lists>
          <ListItem
            imageAs="small"
            heading="Emon Islam"
            textAs="Yestarday, 5am"
            button="button"
            buttonText="Unblock"
          />
        </Lists>
      </section>
    </Grid>
  );
};

export default BlockList;
