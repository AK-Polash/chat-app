import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import { Alert } from "@mui/material/";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ForwardMessage = ({ message }) => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [friends, setFriends] = useState([]);
  let [buttonChange, setButtonChange] = useState([]);
  let [loader, setLoader] = useState(false);

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

  let handleSendMsg = (msgItem) => {
    if (data.activeChat.focusedItem.status === "single") {
      set(push(ref(db, "singleMsg/")), {
        whoSendName: data.userData.userInfo.displayName,
        whoSendId: data.userData.userInfo.uid,
        whoReceiveName:
          data.userData.userInfo.uid === msgItem.senderId
            ? msgItem.receiverName
            : msgItem.senderName,

        whoReceiveId:
          data.userData.userInfo.uid === msgItem.senderId
            ? msgItem.receiverId
            : msgItem.senderId,
        msg: message.msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
      }).then(() => {
        setButtonChange(msgItem.senderId + msgItem.receiverId);
        toast(
          `Forwarded to ${
            data.userData.userInfo.uid === msgItem.senderId
              ? msgItem.receiverName
              : msgItem.senderName
          }`
        );
      });
    }
  };

  let id =
    data.activeChat.focusedItem.senderId === data.userData.userInfo.uid
      ? data.activeChat.focusedItem.receiverId
      : data.activeChat.focusedItem.senderId;

  return (
    <section className="section__main">
      <ContentHeading heading="Friends" />

      <Lists>
        {friends.length > 0 ? (
          friends.map((item, index) =>
            data.userData.userInfo.uid === item.receiverId
              ? id !== item.senderId &&
                (buttonChange.includes(
                  item.senderId + data.userData.userInfo.uid
                ) ? (
                  <ListItem
                    key={index}
                    imageAs="small"
                    photoURL={item.senderPhoto}
                    userAs="active"
                    heading={item.senderName}
                    textAs="hello..!"
                    button="afterClickButton"
                    buttonText="Sent"
                    loader={loader}
                  />
                ) : (
                  <ListItem
                    key={index}
                    imageAs="small"
                    photoURL={item.senderPhoto}
                    userAs="active"
                    heading={item.senderName}
                    textAs="hello..!"
                    button="button"
                    buttonText="Send"
                    handleClick={() => handleSendMsg(item)}
                    loader={loader}
                  />
                ))
              : id !== item.receiverId &&
                (buttonChange.includes(
                  data.userData.userInfo.uid + item.receiverId
                ) ? (
                  <ListItem
                    key={index}
                    imageAs="small"
                    photoURL={item.receiverPhoto}
                    userAs="active"
                    heading={item.receiverName}
                    textAs="hi..!"
                    button="afterClickButton"
                    buttonText="Sent"
                    loader={loader}
                  />
                ) : (
                  <ListItem
                    key={index}
                    imageAs="small"
                    photoURL={item.receiverPhoto}
                    userAs="active"
                    heading={item.receiverName}
                    textAs="hi..!"
                    button="button"
                    buttonText="Send"
                    handleClick={() => handleSendMsg(item)}
                    loader={loader}
                  />
                ))
          )
        ) : (
          <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
            No Friends..!
          </Alert>
        )}
      </Lists>
    </section>
  );
};

export default ForwardMessage;
