import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import {
  Grid,
  Alert,
  Modal,
  Fade,
  Box,
  Typography,
  Backdrop,
} from "@mui/material/";

import {
  getDatabase,
  set,
  push,
  ref as databaseRef,
  onValue,
  update,
} from "firebase/database";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 520,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MyGroups = () => {
  let db = getDatabase();
  let data = useSelector((state) => state);
  let [groups, setGroups] = useState([]);
  let [groupRequest, setGroupRequest] = useState([]);

  // Modals:
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

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

  let handleGroupInfo = (infoItem) => {
    console.log(infoItem);
  };

  let handleGroupRequest = (requestItem) => {
    setOpen(true);

    const groupJoinRequestRef = databaseRef(db, "groupJoinRequest/");
    onValue(groupJoinRequestRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        if (requestItem.id === item.val().groupId) {
          arr.push({ ...item.val(), groupRequestId: item.key });
        }
      });
      setGroupRequest(arr);
    });
  };

  let handleAcceptGroupReq = (acceptItem) => {};

  let handleRejectGroupReq = (rejectItem) => {};

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
                button="dualButton"
                buttonOneText="Info"
                buttonOneOnclick={() => handleGroupInfo(item)}
                buttonTwoText="Request"
                buttonTwoOnclick={() => handleGroupRequest(item)}
                userAs="active"
              />
            ))
          ) : (
            <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
              Empty Group List..!
            </Alert>
          )}
        </Lists>

        {/* ================================ Modal start ===================================== */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Group Requests
              </Typography>

              {/* ================================ List start ===================================== */}
              <Lists>
                {groupRequest.length > 0 ? (
                  groupRequest.map((item) => (
                    <ListItem
                      key={item.groupRequestId}
                      imageAs="small"
                      photoURL={item.senderPhoto}
                      heading={item.senderName}
                      textAs="wants to join your group"
                      button="dualButton"
                      buttonOneText="accept"
                      buttonOneOnclick={() => handleAcceptGroupReq(item)}
                      buttonTwoText="reject"
                      buttonTwoOnclick={() => handleRejectGroupReq(item)}
                      userAs="active"
                    />
                  ))
                ) : (
                  <Alert
                    sx={{ marginTop: "20px" }}
                    variant="filled"
                    severity="info"
                  >
                    No Group Request..!
                  </Alert>
                )}
              </Lists>
              {/* ================================ List end ===================================== */}
            </Box>
          </Fade>
        </Modal>
        {/* ================================ Modal end ===================================== */}
      </section>
    </Grid>
  );
};

export default MyGroups;
