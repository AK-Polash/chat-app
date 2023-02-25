import React, { useState, useEffect, useRef } from "react";
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
  Menu,
  MenuItem,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "./message.css";
import ProfileContentHeading from "../../components/ProfileContentHeading";
import { TbSend } from "react-icons/tb";
import { BsEmojiSmile, BsFillReplyFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { set, push, ref, getDatabase, onValue } from "firebase/database";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Message = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
      let clickedId = data.activeChat.focusedItem
        ? data.activeChat.focusedItem.receiverId === data.userData.userInfo.uid
          ? data.activeChat.focusedItem.senderId
          : data.activeChat.focusedItem.receiverId
        : "";

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

  // Scroll to Bottom Functionality :
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

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

              <div className="chat__box">
                {msgList.map((item, index) =>
                  data.userData.userInfo.uid === item.whoSendId ? (
                    <div className="sender" key={index}>
                      <div className="msg__wrapper">
                        <div className="msg__action">
                          <BsFillReplyFill
                            className="reply__icon"
                            title="reply"
                          />
                          <div>
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={handleClick}
                              title="more"
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                            >
                              <MenuItem onClick={handleClose}>Remove</MenuItem>
                              <MenuItem onClick={handleClose}>Forward</MenuItem>
                            </Menu>
                          </div>
                        </div>
                        <div className="chat sender__chat"> {item.msg} </div>
                      </div>
                      <div
                        className="chat__moment chat__moment__sender"
                        ref={messagesEndRef}
                      >
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </div>
                    </div>
                  ) : (
                    <div className="receiver" key={index}>
                      <div className="msg__wrapper">
                        <div className="chat receiver__chat"> {item.msg} </div>
                        <div className="msg__action">
                          <div>
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={handleClick}
                              title="more"
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                            >
                              <MenuItem onClick={handleClose}>Remove</MenuItem>
                              <MenuItem onClick={handleClose}>Forward</MenuItem>
                            </Menu>
                          </div>
                          <BsFillReplyFill
                            className="reply__icon"
                            title="reply"
                          />
                        </div>
                      </div>
                      <div
                        className="chat__moment chat__moment__receiver"
                        ref={messagesEndRef}
                      >
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </div>
                    </div>
                  )
                )}
              </div>

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
