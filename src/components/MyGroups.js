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
  remove,
} from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { activeChatUser } from "../slices/activeChatSlice";
import { toast } from "react-toastify";

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
  let dispatch = useDispatch();
  let [groups, setGroups] = useState([]);
  let [groupRequest, setGroupRequest] = useState([]);
  let [groupMembers, setGroupMembers] = useState([]);
  let [groupM, setGroupM] = useState([]);
  let [groupMembersAsMembebr, setGroupMembersAsMembebr] = useState([]);
  let [memberList, setMemberList] = useState([]);
  let [loader, setLoader] = useState(false);

  // Modals:
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openInfoAsMember, setOpenInfoAsMember] = useState(false);
  const handleClose = () => setOpen(false);
  const handleCloseInfo = () => setOpenInfo(false);
  const handleCloseInfoAsMember = () => setOpenInfoAsMember(false);

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

  useEffect(() => {
    const groupMembersRef = databaseRef(db, "groupMembers/");
    onValue(groupMembersRef, (snapshot) => {
      let arr = [];
      let arrTwo = [];

      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid === item.val().memberId) {
          arr.push({ ...item.val(), id: item.key });
        }

        arrTwo.push({ ...item.val(), groupMembersId: item.key });
      });

      setGroupM(arr);
      setGroupMembersAsMembebr(arrTwo);
    });
  }, []);

  let handleGroupInfo = (infoItem) => {
    setOpenInfo(true);

    const groupMembersRef = databaseRef(db, "groupMembers/");
    onValue(groupMembersRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        if (infoItem.id === item.val().groupId) {
          arr.push({ ...item.val(), groupMembersId: item.key });
        }
      });
      setGroupMembers(arr);
    });
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

  let handleGroupDelete = (deleteItem) => {
    setLoader(true);

    remove(databaseRef(db, "groups/" + deleteItem.id)).then(() => {
      toast("Group deleted");
      setLoader(false);
    });
  };

  let handleAcceptGroupReq = (acceptItem) => {
    setLoader(true);

    remove(
      databaseRef(db, "groupJoinRequest/" + acceptItem.groupRequestId)
    ).then(() => {
      set(push(databaseRef(db, "groupMembers/")), {
        groupAdminName: acceptItem.adminName,
        groupAdminId: acceptItem.adminId,
        groupName: acceptItem.groupName,
        groupTag: acceptItem.groupTag,
        groupId: acceptItem.groupId,
        groupPhoto: acceptItem.groupPhoto ? acceptItem.groupPhoto : "",
        memberName: acceptItem.senderName,
        memberId: acceptItem.senderId,
        memberPhoto: acceptItem.senderPhoto ? acceptItem.senderPhoto : "",
      }).then(() => {
        toast("Accepted group Request");
        setLoader(false);
      });
    });
  };

  let handleRejectGroupReq = (rejectItem) => {
    setLoader(true);

    remove(
      databaseRef(db, "groupJoinRequest/" + rejectItem.groupRequestId)
    ).then(() => {
      toast("Rejected group Request");
      setLoader(false);
    });
  };

  let handleRemoveGroupMember = (removeMemberItem) => {
    setLoader(true);

    groupMembers.map((item) => {
      if (removeMemberItem.memberId === item.memberId) {
        remove(databaseRef(db, "groupMembers/" + item.groupMembersId)).then(
          () => {
            toast("Member Removed from this group..!");
            setLoader(false);
          }
        );
      }
    });
  };

  let handleLeaveGroup = (leaveItem) => {
    setLoader(true);

    groupM.map((item) => {
      if (
        leaveItem.id === item.id &&
        data.userData.userInfo.uid === item.memberId
      ) {
        remove(databaseRef(db, "groupMembers/" + item.id)).then(() => {
          setLoader(false);
        });
      }
    });
  };

  let handleGroupInfoAsMember = (infoItem) => {
    setOpenInfoAsMember(true);
    let arr = [];

    groupMembersAsMembebr.map((item) => {
      if (infoItem.groupId === item.groupId) {
        arr.push(item);
      }
    });
    setMemberList(arr);
  };

  let handleChatFocusAsAdmin = (focusItem) => {
    dispatch(activeChatUser({ ...focusItem, status: "group", as: "admin" }));
  };

  let handleChatFocusAsMember = (focusItem) => {
    dispatch(activeChatUser({ ...focusItem, status: "group", as: "member" }));
  };

  return (
    <section className="section__main">
      <ContentHeading heading="My Groups" />

      <Lists>
        {groups.length > 0 || groupM.length > 0 ? (
          <>
            {groups.map((item) => (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.groupPhotoURL}
                heading={item.groupName}
                textAs={item.groupTag}
                button="tripleButton"
                buttonOneText="Information"
                buttonOneOnClick={() => handleGroupInfo(item)}
                buttonTwoText="Requests"
                buttonTwoOnClick={() => handleGroupRequest(item)}
                buttonThreeText="Delete"
                buttonThreeOnClick={() => handleGroupDelete(item)}
                userAs="active"
                loader={loader}
                handleChatClick={() => handleChatFocusAsAdmin(item)}
              />
            ))}

            {groupM.map((item) => (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.groupPhoto}
                heading={item.groupName}
                textAs={item.groupTag}
                button="dualButton"
                buttonOneText="Info"
                buttonOneOnclick={() => handleGroupInfoAsMember(item)}
                buttonTwoText="Leave"
                buttonTwoOnclick={() => handleLeaveGroup(item)}
                userAs="active"
                loader={loader}
                handleChatClick={() => handleChatFocusAsMember(item)}
              />
            ))}
          </>
        ) : (
          <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
            Empty Group List..!
          </Alert>
        )}
      </Lists>

      {/* ================================ Group Request Modal start ===================================== */}
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
            <Typography id="transition-modal-title" variant="h6" component="h2">
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
                    loader={loader}
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
      {/* ================================ Group Request Modal end ===================================== */}

      {/* ================================ Group Info Modal start ===================================== */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openInfo}
        onClose={handleCloseInfo}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openInfo}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Group Members
            </Typography>

            {/* ================================ List start ===================================== */}
            <Lists>
              {groupMembers.length > 0 ? (
                groupMembers.map((item) => (
                  <ListItem
                    key={item.groupMembersId}
                    imageAs="small"
                    photoURL={item.memberPhoto}
                    heading={item.memberName}
                    textAs="wants to join your group"
                    button="dualButton"
                    buttonOneText="member"
                    buttonTwoText="kick"
                    buttonTwoOnclick={() => handleRemoveGroupMember(item)}
                    userAs="active"
                    loader={loader}
                  />
                ))
              ) : (
                <Alert
                  sx={{ marginTop: "20px" }}
                  variant="filled"
                  severity="info"
                >
                  No Group Member..!
                </Alert>
              )}
            </Lists>
            {/* ================================ List end ===================================== */}
          </Box>
        </Fade>
      </Modal>
      {/* ================================ Group Info Modal end ===================================== */}

      {/* ================================ Group Info as Membebr Modal start ===================================== */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openInfoAsMember}
        onClose={handleCloseInfoAsMember}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openInfoAsMember}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Group Members as Member
            </Typography>

            {/* ================================ List start ===================================== */}
            <Lists>
              {memberList.length > 0 ? (
                <>
                  {memberList.map((item) => (
                    <ListItem
                      key={item.groupMembersId}
                      imageAs="small"
                      photoURL={item.memberPhoto}
                      heading={item.memberName}
                      textAs="wants to join your group"
                      button="button"
                      buttonText="member"
                      userAs="active"
                      loader={loader}
                    />
                  ))}

                  {/* {memberList.map(
                      (item, index) =>
                        item.groupAdminName && (
                          <ListItem
                            key={index + 1000}
                            imageAs="small"
                            photoURL={item.groupPhoto}
                            heading={item.groupAdminName}
                            textAs="Admin of the group"
                            button="button"
                            buttonText="Admin"
                            userAs="active"
                            loader={loader}
                          />
                        )
                    )} */}
                </>
              ) : (
                <Alert
                  sx={{ marginTop: "20px" }}
                  variant="filled"
                  severity="info"
                >
                  No Group Member..!
                </Alert>
              )}
            </Lists>
            {/* ================================ List end ===================================== */}
          </Box>
        </Fade>
      </Modal>
      {/* ================================ Group Info as Membebr Modal end ===================================== */}
    </section>
  );
};

export default MyGroups;
