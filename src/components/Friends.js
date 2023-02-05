import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
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

  // Block Functionality:
  let handleBlock = (item) => {
    // Based on Friend Request: I 'Received'/'Send' "Friend Request" ..?
    data.userData.userInfo.uid === item.senderId
      ? set(push(ref(db, "blockList/")), {
          blockName: item.receiverName,
          blockId: item.receiverId,
          blockPhoto: item.receiverPhoto ? item.receiverPhoto : "",
          blockByName: item.senderName,
          blockById: item.senderId,
          blockByPhoto: item.senderPhoto ? item.senderPhoto : "",
        })
          .then(() => {
            remove(ref(db, "friends/" + item.id));
          })
          .catch((error) => {
            console.log(error.code);
          })
      : set(push(ref(db, "blockList/")), {
          blockName: item.senderName,
          blockId: item.senderId,
          blockPhoto: item.senderPhoto ? item.senderPhoto : "",
          blockByName: item.receiverName,
          blockById: item.receiverId,
          blockByPhoto: item.receiverPhoto ? item.receiverPhoto : "",
        })
          .then(() => {
            remove(ref(db, "friends/" + item.id));
          })
          .catch((error) => {
            console.log(error.code);
          });
  };

  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="Friends" />

        <Lists>
          {friends.length > 0 ? (
            friends.map((item, index) =>
              data.userData.userInfo.uid === item.receiverId ? (
                <ListItem
                  key={index}
                  imageAs="small"
                  photoURL={item.senderPhoto}
                  // userAs="active"
                  heading={item.senderName}
                  textAs="hello..!"
                  button="buttonAndText"
                  contentText={item.date}
                  buttonText="Block"
                  buttonAndTextOnclick={() => handleBlock(item)}
                />
              ) : (
                <ListItem
                  key={index}
                  imageAs="small"
                  photoURL={item.receiverPhoto}
                  userAs="active"
                  heading={item.receiverName}
                  textAs="hi..!"
                  button="buttonAndText"
                  contentText={item.date}
                  buttonText="Block"
                  buttonAndTextOnclick={() => handleBlock(item)}
                />
              )
            )
          ) : (
            <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
              No Friends..!
            </Alert>
          )}
        </Lists>
      </section>
    </Grid>
  );
};

export default Friends;
