import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import {
  getDatabase,
  set,
  push,
  ref as databaseRef,
  onValue,
  remove,
  update,
} from "firebase/database";
import {
  Grid,
  Modal,
  TextField,
  Box,
  Fade,
  Backdrop,
  Button,
  Avatar,
  IconButton,
  Alert,
} from "@mui/material/";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { HiPlus } from "react-icons/hi";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useSelector, useDispatch } from "react-redux";
import { ColorRing } from "react-loader-spinner";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  rowGap: "20px",
};

const GroupList = () => {
  let [groupFormData, setGroupFormData] = useState({
    groupName: "",
    groupTag: "",
  });

  let [errorMsg, setErrorMsg] = useState({
    groupName: "",
    groupTag: "",
  });

  let handleForm = (e) => {
    let { name, value } = e.target;

    setGroupFormData({ ...groupFormData, [name]: value });
    setErrorMsg({ ...errorMsg, [name]: "" });
  };

  // all variables:
  let db = getDatabase();
  let data = useSelector((state) => state);
  let [loader, setLoader] = useState(false);
  let [disable, setDisable] = useState(false);
  let [groups, setGroups] = useState([]);
  let [groupRequestConnection, setGroupRequestConnection] = useState([]);
  let [groupRequestConnectionKey, setGroupRequestConnectionKey] = useState([]);
  let [groupMemberConnection, setGroupMemberConnection] = useState([]);

  // Modal:
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // cropper start
  const [image, setImage] = useState();
  const [cropper, setCropper] = useState();

  const onChange = (e) => {
    // setShow(true);
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    let groupNameRegex =
      /^([a-zA-Z0-9]+|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{1,}|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{3,}\s{1}[a-zA-Z0-9]{1,})$/g;

    let groupTagRegex =
      /^([a-zA-Z0-9]+|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{1,}|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{3,}\s{1}[a-zA-Z0-9]{1,})$/g;

    if (!groupFormData.groupName) {
      setErrorMsg({ ...errorMsg, groupName: "Group Name Required" });
    } else if (!groupNameRegex.test(groupFormData.groupName)) {
      setErrorMsg({ ...errorMsg, groupName: "Enter valid Group Name" });
    } else if (!groupFormData.groupTag) {
      setErrorMsg({ ...errorMsg, groupTag: "Group Tag Required" });
    } else if (!groupTagRegex.test(groupFormData.groupTag)) {
      setErrorMsg({ ...errorMsg, groupTag: "Enter valid Group Tag" });
    } else if (!cropper) {
      setErrorMsg({ ...errorMsg, groupTag: "Choose an Image" });
    } else {
      setErrorMsg({ ...errorMsg, groupName: "", groupTag: "" });

      if (typeof cropper !== "undefined") {
        setLoader(true);
        setDisable(true);

        setGroupFormData({
          ...groupFormData,
          groupName: "",
          groupTag: "",
        });

        const storage = getStorage();
        const storageRef = ref(
          storage,
          `group-picture/${data.userData.userInfo.uid}`
        );

        const message4 = cropper.getCroppedCanvas().toDataURL();
        uploadString(storageRef, message4, "data_url").then((snapshot) => {
          getDownloadURL(storageRef).then((downloadURL) => {
            set(push(databaseRef(db, "groups/")), {
              groupPhotoURL: downloadURL,
              groupName: groupFormData.groupName,
              groupTag: groupFormData.groupTag,
              adminId: data.userData.userInfo.uid,
              adminName: data.userData.userInfo.displayName,
              // date: `${new Date().getDate()} - ${
              //   new Date().getMonth() + 1
              // } - ${new Date().getFullYear()} `,
            })
              .then(() => {
                setOpen(false);
                setImage("");
                setLoader(false);
                setDisable(false);

                console.log("Group Created..!");
              })
              .catch((error) => {
                console.log(error);
              });
          });
        });
      }
    }
  };
  // croper end

  useEffect(() => {
    const groupRef = databaseRef(db, "groups/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid !== item.val().adminId) {
          arr.push({ ...item.val(), id: item.key });
        }
      });

      setGroups(arr);
    });
  }, []);

  useEffect(() => {
    const groupJoinRequestRef = databaseRef(db, "groupJoinRequest/");
    onValue(groupJoinRequestRef, (snapshot) => {
      let arr = [];
      let arrTwo = [];

      snapshot.forEach((item) => {
        arr.push(item.val().senderId + item.val().groupId);
        arrTwo.push({ ...item.val(), id: item.key });
      });

      setGroupRequestConnection(arr);
      setGroupRequestConnectionKey(arrTwo);
    });
  }, []);

  useEffect(() => {
    const groupMembersRef = databaseRef(db, "groupMembers/");
    onValue(groupMembersRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        arr.push(item.val().memberId + item.val().groupId);
      });

      setGroupMemberConnection(arr);
    });
  }, []);

  // ke jon dibe, kun group e join dibe
  let handleGroupJoin = (adId, adName, gId, gName, gPhoto, gTag) => {
    setLoader(true);

    set(push(databaseRef(db, "groupJoinRequest")), {
      adminId: adId,
      adminName: adName,
      groupId: gId,
      groupName: gName,
      groupPhoto: gPhoto,
      groupTag: gTag,
      senderId: data.userData.userInfo.uid,
      senderName: data.userData.userInfo.displayName,
      senderPhoto: data.userData.userInfo.photoURL
        ? data.userData.userInfo.photoURL
        : "",
    }).then(() => {
      setLoader(false);
    });
  };

  let handleCancelGroupJoin = (groupItem) => {
    setLoader(true);

    groupRequestConnectionKey.map((item) => {
      if (item.groupId === groupItem.id) {
        remove(databaseRef(db, "groupJoinRequest/" + item.id)).then(() => {
          setLoader(false);
        });
      }
    });
  };

  return (
    <Grid item xs={4}>
      <section className="section__main">
        <div className="section__heading  less__padding">
          <h2 className="section__heading__title"> Group List </h2>
          <button
            onClick={handleOpen}
            className="create__group__button"
            title="Create Group"
          >
            <HiPlus className="button__icon" />
          </button>
        </div>

        <Lists>
          {/* sender Id + Group Id */}
          {groups.length > 0 ? (
            groups.map((item, index) =>
              groupRequestConnection.includes(
                data.userData.userInfo.uid + item.id
              ) ? (
                <ListItem
                  key={index}
                  imageAs="large"
                  photoURL={item.groupPhotoURL}
                  heading={item.groupName}
                  headingAs="h4"
                  textAs={item.groupTag}
                  button="dualButton"
                  buttonOneText="Pending"
                  buttonTwoText="Cancel"
                  buttonTwoOnclick={() => handleCancelGroupJoin(item)}
                  loader={loader}
                />
              ) : groupMemberConnection.includes(
                  data.userData.userInfo.uid + item.id
                ) ? (
                <ListItem
                  key={index}
                  imageAs="large"
                  photoURL={item.groupPhotoURL}
                  heading={item.groupName}
                  headingAs="h4"
                  textAs={item.groupTag}
                  button="button"
                  buttonText="Member"
                  loader={loader}
                />
              ) : (
                <ListItem
                  key={index}
                  imageAs="large"
                  photoURL={item.groupPhotoURL}
                  heading={item.groupName}
                  headingAs="h4"
                  textAs={item.groupTag}
                  button="button"
                  handleClick={() =>
                    handleGroupJoin(
                      item.adminId,
                      item.adminName,
                      item.id,
                      item.groupName,
                      item.groupPhotoURL,
                      item.groupTag
                    )
                  }
                  buttonText="Join"
                  loader={loader}
                />
              )
            )
          ) : (
            <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
              Empty Group List..!
            </Alert>
          )}
        </Lists>

        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 400,
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <p className="create__group__heading"> Create Group </p>

                <div className="image__holder  image__holder__relative">
                  {image ? (
                    <div className="img-preview"></div>
                  ) : (
                    <div className="image__holder">
                      <Avatar
                        sx={{ width: "100%", height: "100%" }}
                        className="profile__img"
                      />
                    </div>
                  )}

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "-10px",
                      right: "-22px",
                    }}
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    title="Select Image"
                  >
                    <input
                      onChange={onChange}
                      hidden
                      accept="image/*"
                      type="file"
                    />
                    <PhotoCamera />
                  </IconButton>
                </div>

                <div>
                  {errorMsg.groupName ? (
                    <Alert
                      sx={{ margin: "9px 0" }}
                      className="error__alert__message  error__alert__forgot__password"
                      variant="filled"
                      severity="error"
                    >
                      {errorMsg.groupName}
                    </Alert>
                  ) : errorMsg.groupTag ? (
                    <Alert
                      sx={{ margin: "9px 0" }}
                      className="error__alert__message  error__alert__forgot__password"
                      variant="filled"
                      severity="error"
                    >
                      {errorMsg.groupTag}
                    </Alert>
                  ) : (
                    <Alert
                      sx={{ visibility: "hidden" }}
                      className="error__alert__message  error__alert__forgot__password"
                      variant="filled"
                      severity="error"
                    >
                      Hidden
                    </Alert>
                  )}
                </div>

                <div>
                  {image && (
                    <Cropper
                      style={{ height: 180, width: "100%" }}
                      zoomTo={0.5}
                      initialAspectRatio={1}
                      preview=".img-preview"
                      src={image}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      guides={true}
                    />
                  )}
                </div>

                <TextField
                  disabled={disable}
                  onChange={handleForm}
                  label="Group Name"
                  variant="standard"
                  name="groupName"
                  value={groupFormData.groupName}
                  required
                />

                <TextField
                  disabled={disable}
                  onChange={handleForm}
                  label="Tagline"
                  variant="standard"
                  name="groupTag"
                  value={groupFormData.groupTag}
                  required
                />

                {loader ? (
                  <ColorRing
                    visible={true}
                    height="42"
                    width="42"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{ alignSelf: "center" }}
                    wrapperClass="blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                ) : (
                  <Button
                    onClick={getCropData}
                    type="submit"
                    variant="contained"
                  >
                    Create Group
                  </Button>
                )}
              </Box>
            </Fade>
          </Modal>
        </div>
      </section>
    </Grid>
  );
};

export default GroupList;
