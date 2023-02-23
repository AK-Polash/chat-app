import React, { useState, useEffect } from "react";
import MyGroups from "../../components/MyGroups";
import Friends from "../../components/Friends";
import {
  Box,
  Grid,
  Divider,
  TextField,
  Button,
  IconButton,
  Container,
  Alert,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "./message.css";
import ProfileContentHeading from "../../components/ProfileContentHeading";
import { TbSend } from "react-icons/tb";
import { BsEmojiSmile } from "react-icons/bs";
import { useSelector } from "react-redux";
import { set, push, ref, getDatabase, onValue } from "firebase/database";
import moment from "moment";

const Message = () => {
  let data = useSelector((state) => state);
  let db = getDatabase();

  let [msgList, setMsgList] = useState([]);

  let [formData, setFormData] = useState({
    sms: "",
    photo: "",
  });

  let handleSubmit = () => {
    if (data.activeChat.focusedItem.status === "single") {
      set(push(ref(db, "singleMsg/")), {
        whoSendName: data.userData.userInfo.displayName,
        whoSendId: data.userData.userInfo.uid,
        whoReceiveName: data.activeChat.focusedItem
          ? data.userData.userInfo.uid === data.activeChat.focusedItem.senderId
            ? data.activeChat.focusedItem.receiverName
            : data.activeChat.focusedItem.senderName
          : "",
        whoReceiveId: data.activeChat.focusedItem
          ? data.userData.userInfo.uid === data.activeChat.focusedItem.senderId
            ? data.activeChat.focusedItem.receiverId
            : data.activeChat.focusedItem.senderId
          : "",
        msg: formData.sms,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
      })
        .then(() => {
          setFormData({ ...formData, sms: "", photo: "" });
        })
        .catch((error) => {
          console.log(error.code);
        });
    }
  };

  useEffect(() => {
    const signleMsgRef = ref(db, "singleMsg");
    onValue(signleMsgRef, (snapshot) => {
      let arr = [];
      let clickedId =
        data.activeChat.focusedItem.receiverId === data.userData.userInfo.uid
          ? data.activeChat.focusedItem.senderId
          : data.activeChat.focusedItem.receiverId;

      snapshot.forEach((item) => {
        if (
          (item.val().whoSendId === data.userData.userInfo.uid &&
            item.val().whoReceiveId === clickedId) ||
          (item.val().whoSendId === clickedId &&
            item.val().whoReceiveId === data.userData.userInfo.uid)
        ) {
          arr.push({ ...item.val(), id: item.key });
        }
      });

      setMsgList(arr);
    });
  }, [data.activeChat.focusedItem]);

  return (
    <>
      <Grid container columnSpacing={2}>
        <Grid item xs={4.4}>
          <MyGroups />
          <br />
          <Friends />
        </Grid>

        <Grid
          item
          xs={7.6}
          sx={{
            display: data.activeChat.focusedItem ? "block" : "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data.activeChat.focusedItem ? (
            <Box
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                padding: "0 30px",
              }}
            >
              <ProfileContentHeading
                userAs="active"
                title={
                  data.activeChat.focusedItem
                    ? data.userData.userInfo.uid ===
                      data.activeChat.focusedItem.senderId
                      ? data.activeChat.focusedItem.receiverName
                      : data.activeChat.focusedItem.senderName
                    : "Default Name"
                }
                photoURL={
                  data.activeChat.focusedItem
                    ? data.userData.userInfo.uid ===
                      data.activeChat.focusedItem.senderId
                      ? data.activeChat.focusedItem.receiverPhoto
                      : data.activeChat.focusedItem.senderPhoto
                    : ""
                }
              />
              <Divider />

              <Box
                sx={{
                  width: "100%",
                  height: "480px",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "10px",
                  padding: "15px 30px",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  position: "relative",
                }}
              >
                {msgList.map((item, index) =>
                  data.userData.userInfo.uid === item.whoSendId ? (
                    <div className="sender" key={index}>
                      <div className="chat sender__chat"> {item.msg} </div>
                      <div className="chat__moment">
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </div>
                    </div>
                  ) : (
                    <div className="receiver" key={index}>
                      <div className="chat receiver__chat"> {item.msg} </div>
                      <div className="chat__moment">
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </div>
                    </div>
                  )
                )}
              </Box>

              <Divider />
              <div className="input__main">
                <Container
                  sx={{
                    display: "flex",
                    columnGap: "20px",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <TextField
                    placeholder="type message"
                    size="small"
                    multiline={false}
                    name="sms"
                    onChange={(e) =>
                      setFormData({ ...formData, sms: e.target.value })
                    }
                    value={formData.sms}
                    sx={{
                      width: "80%",
                      background: "#F1F1F1",
                    }}
                  />

                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: "190px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      name="photo"
                      onChange={(e) =>
                        setFormData({ ...formData, photo: e.target.value })
                      }
                    />
                    <PhotoCamera />
                  </IconButton>

                  <BsEmojiSmile className="emoji__icon" />

                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    <TbSend className="send__icon" />
                  </Button>
                </Container>
              </div>
            </Box>
          ) : (
            <Alert
              severity="info"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "70%",
              }}
            >
              Select Friends to Send Message..!
            </Alert>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Message;
