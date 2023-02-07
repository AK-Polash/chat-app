import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import { Grid, Alert } from "@mui/material/";
import {
  getDatabase,
  set,
  push,
  ref as databaseRef,
  onValue,
  update,
} from "firebase/database";
import { useSelector } from "react-redux";

const MyGroups = () => {
  let db = getDatabase();
  let data = useSelector((state) => state);
  let [groups, setGroups] = useState([]);

  useEffect(() => {
    const groupRef = databaseRef(db, "groups/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid === item.val().adminId) {
          arr.push({ ...item.val(), id: item.key });
        }
      });

      setGroups(arr);
    });
  }, []);

  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="My Groups" />

        <Lists>
          {groups.length > 0 ? (
            groups.map((item) => (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.groupPhotoURL}
                heading={item.groupName}
                textAs={item.groupTag}
                buttonText="Today, 8pm"
                userAs="active"
              />
            ))
          ) : (
            <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
              Empty Group List..!
            </Alert>
          )}
        </Lists>
      </section>
    </Grid>
  );
};

export default MyGroups;
