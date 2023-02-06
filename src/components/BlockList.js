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
  let [loader, setLoader] = useState(false);

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
            blockPhoto: item.val().blockPhoto,
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
    setLoader(true);

    // senderName, senderId, receiverName, & receiverId are not Always True after Unblocking person...!!
    set(push(ref(db, "friends/")), {
      date: `${new Date().getDate()} - ${
        new Date().getMonth() + 1
      } - ${new Date().getFullYear()} `,

      senderName: item.blockName,
      senderId: item.blockId,
      senderPhoto: item.blockPhoto ? item.blockPhoto : "",
      receiverName: data.userData.userInfo.displayName,
      receiverId: data.userData.userInfo.uid,
      receiverPhoto: data.userData.userInfo.photoURL
        ? data.userData.userInfo.photoURL
        : "",
    }).then(() => {
      remove(ref(db, "blockList/" + item.id));
      setLoader(false);
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
                photoURL={item.blockPhoto}
                heading={item.blockName}
                textAs={item.date}
                button="button"
                buttonText="Unblock"
                handleClick={() => handleUnBlock(item)}
                loader={loader}
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
