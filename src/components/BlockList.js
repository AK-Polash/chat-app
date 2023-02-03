import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import Grid from "@mui/material/Grid";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";

const BlockList = () => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [blockList, setBlockList] = useState([]);

  useEffect(() => {
    const blockListRef = ref(db, "blockList/");
    onValue(blockListRef, (snapshot) => {
      let blockListArr = [];

      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid === item.val().blockById) {
          blockListArr.push({
            id: item.key,
            blockName: item.val().blockName,
            blockId: item.val().blockId,
            date: `${new Date().getDate()} - ${
              new Date().getMonth() + 1
            } - ${new Date().getFullYear()} `,
          });
        }
      });
      setBlockList(blockListArr);
    });
  }, []);

  // Unblock Functionality:
  let handleUnBlock = (item) => {
    // senderName, senderId, receiverName, & receiverId are not Always True after Unblocking person...!!
    set(push(ref(db, "friends/")), {
      date: `${new Date().getDate()} - ${
        new Date().getMonth() + 1
      } - ${new Date().getFullYear()} `,

      senderName: item.blockName,
      senderId: item.blockId,
      receiverName: data.userData.userInfo.displayName,
      receiverId: data.userData.userInfo.uid,
    }).then(() => {
      remove(ref(db, "blockList/" + item.id));
    });
  };

  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="Block List" />

        <Lists>
          {blockList.length > 0 ? (
            blockList.map((item) => (
              <ListItem
                key={item.id}
                imageAs="small"
                heading={item.blockName}
                textAs={item.date}
                button="button"
                buttonText="Unblock"
                handleClick={() => handleUnBlock(item)}
              />
            ))
          ) : (
            <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
              Empty Block List..!
            </Alert>
          )}
        </Lists>
      </section>
    </Grid>
  );
};

export default BlockList;
