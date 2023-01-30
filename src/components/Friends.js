import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import Grid from "@mui/material/Grid";
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";

const Friends = () => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [friends, setFriends] = useState([]);

  useEffect(() => {
    const friendsRef = ref(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let friendsArr = [];

      snapshot.forEach((item) => {
        if (
          data.userData.userInfo.uid === item.val().receiverId ||
          data.userData.userInfo.uid === item.val().senderId
        ) {
          friendsArr.push({ ...item.val(), id: item.key });
        }
      });

      setFriends(friendsArr);
    });
  }, []);

  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="Friends" />

        <Lists>
          {friends.map((item, index) =>
            data.userData.userInfo.uid === item.receiverId ? (
              <ListItem
                key={index}
                imageAs="small"
                // userAs="active"
                heading={item.senderName}
                textAs="hello..!"
                buttonText={item.date}
              />
            ) : (
              <ListItem
                key={index}
                imageAs="small"
                userAs="active"
                heading={item.receiverName}
                textAs="hello..!"
                buttonText={item.date}
              />
            )
          )}
        </Lists>
      </section>
    </Grid>
  );
};

export default Friends;
