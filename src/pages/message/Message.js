import React, { useState } from "react";
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
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "./message.css";
import ProfileContentHeading from "../../components/ProfileContentHeading";
import { TbSend } from "react-icons/tb";
import { BsEmojiSmile } from "react-icons/bs";
import { useSelector } from "react-redux";

const Message = () => {
  let data = useSelector((state) => state);

  let [formData, setFormData] = useState({
    sms: "",
    photo: "",
  });

  let handleSubmit = () => {
    console.log(formData);
  };

  return (
    <>
      <Grid container columnSpacing={2}>
        <Grid item xs={4.4}>
          <MyGroups />
          <br />
          <Friends />
        </Grid>

        <Grid item xs={7.6} sx={{ display: "" }}>
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
                  : "Default Khan"
              }
              status="Online"
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
                alignItems: "center",
                justifyContent: "center",
                rowGap: "10px",
                padding: "15px 30px",
                overflowY: "scroll",
                overflowX: "hidden",
                position: "relative",
              }}
            >
              <div className="receiver">
                <div className="chat receiver__chat"> Receiver </div>
                <div className="chat__moment"> Just now </div>
              </div>

              <div className="sender">
                <div className="chat sender__chat"> Sender </div>
                <div className="chat__moment"> Just now </div>
              </div>
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
        </Grid>
      </Grid>
    </>
  );
};

export default Message;
