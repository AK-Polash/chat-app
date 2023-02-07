import React, { useState } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import Image from "./Image";
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

  let db = getDatabase();
  let data = useSelector((state) => state);
  let dispatch = useDispatch();

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
    // setLoader(true);

    if (typeof cropper !== "undefined") {
      // firebase "Upload from a String":
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `group-picture/${data.userData.userInfo.uid}`
      );
      // Data URL string
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        // setLoader(false);
        // setShow(false);

        getDownloadURL(storageRef).then((downloadURL) => {
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
          } else if (!downloadURL) {
            setErrorMsg({ ...errorMsg, groupTag: "Enter Group Image" });
          } else {
            set(push(databaseRef(db, "groups/")), {
              groupPhotoURL: downloadURL,
              groupName: groupFormData.groupName,
              groupTag: groupFormData.groupTag,
              adminId: data.userData.userInfo.uid,
              adminName: data.userData.userInfo.displayName,
            }).then(() => {
              setOpen(false);
              setImage("");
            });

            console.log("Group Created..!");
          }
        });
      });
    }
  };
  // croper end

  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="Group List" />

        <Lists>
          <button
            onClick={handleOpen}
            className="create__group__button"
            title="Create Group"
          >
            <HiPlus />
          </button>

          <ListItem
            imageAs="large"
            heading="Friends Forever"
            headingAs="h4"
            textAs="Hi all..!"
            button="button"
            buttonText="Join"
          />
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
                  onChange={handleForm}
                  label="Group Name"
                  variant="standard"
                  name="groupName"
                  required
                />

                <TextField
                  onChange={handleForm}
                  label="Tagline"
                  variant="standard"
                  name="groupTag"
                  required
                />

                <Button onClick={getCropData} type="submit" variant="contained">
                  Create Group
                </Button>
              </Box>
            </Fade>
          </Modal>
        </div>
      </section>
    </Grid>
  );
};

export default GroupList;
