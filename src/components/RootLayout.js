import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../slices/userSlice";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Image from "./Image";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 530,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const RootLayout = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let data = useSelector((state) => state);

  // modal:
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // croper start
  const [image, setImage] = useState();
  const [cropper, setCropper] = useState();

  const onChange = (e) => {
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
    if (typeof cropper !== "undefined") {
      // firebase "Upload from a String":
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `profile-picture/${data.userData.userInfo.uid}`
      );
      // Data URL string
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        setOpen(false);
        setImage("");

        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            dispatch(activeUser(auth.currentUser));
            localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));

            console.log("profile updated..!!");
          });
        });
      });
    }
  };
  // croper end

  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);

  let handleLogOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(activeUser(null));
        localStorage.removeItem("userInfo");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Grid container columnSpacing={2} sx={{ padding: "0 16px" }}>
        <Grid
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          item
          xs={1}
        >
          <div className="menu__main">
            <div className="user__holder">
              <div className="image__holder">
                {data.userData.userInfo.photoURL ? (
                  <Image
                    onClick={handleOpen}
                    className="profile__img"
                    imageSource={data.userData.userInfo.photoURL}
                    alt="Profile Img"
                  />
                ) : (
                  <Image
                    className="profile__img"
                    imageSource="assets/profile__img.png"
                    alt="UserProfile Img"
                  />
                )}
              </div>
              <h4 className="user__name">
                {data.userData.userInfo.displayName}
              </h4>
            </div>
            <div className="menu__holder">
              <div className="menu">
                <div className="icon__holder">
                  <NavLink to="/">
                    <IoHomeOutline className="icon" title="Home" />
                  </NavLink>
                </div>
                <div className="icon__holder">
                  <NavLink to="message">
                    <AiOutlineMessage className="icon" title="Chat" />
                  </NavLink>
                </div>
                <div className="icon__holder">
                  <NavLink to="notification">
                    <IoMdNotificationsOutline
                      className="icon"
                      title="Notification"
                    />
                  </NavLink>
                </div>
                <div className="icon__holder">
                  <NavLink to="settings">
                    <IoSettingsOutline className="icon" title="Settings" />
                  </NavLink>
                </div>
              </div>
              <div className="logout__holder">
                <RiLogoutBoxRLine
                  onClick={handleLogOut}
                  className="icon"
                  title="Log Out"
                />
              </div>
            </div>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="modal__heading">
                  <p className="modal__title">Upload Image</p>

                  {image ? (
                    <div className="img-preview"></div>
                  ) : data.userData.userInfo.photoURL ? (
                    <div className="image__holder">
                      <Image
                        className="profile__img"
                        imageSource={data.userData.userInfo.photoURL}
                        alt="UserProfile Img"
                      />
                    </div>
                  ) : (
                    <div className="image__holder">
                      <Image
                        className="profile__img"
                        imageSource="assets/profile__img.png"
                        alt="UserProfile Img"
                      />
                    </div>
                  )}
                </div>
                <div className="modal__input__box">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      onClick={getCropData}
                      variant="contained"
                      component="label"
                      size="small"
                    >
                      Upload
                    </Button>

                    <IconButton
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
                  </Stack>

                  {image && (
                    <Cropper
                      style={{ height: 400, width: "100%" }}
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
              </Box>
            </Modal>
          </div>
        </Grid>
        <Grid
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          item
          xs={11}
        >
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};

export default RootLayout;
