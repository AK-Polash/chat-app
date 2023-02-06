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
import {
  getDatabase,
  update,
  ref as databaseRef,
  onValue,
} from "firebase/database";
import {
  Grid,
  Button,
  IconButton,
  Stack,
  Box,
  Modal,
  Avatar,
} from "@mui/material/";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Image from "./Image";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ToastContainer, toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";

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
  let db = getDatabase();
  const auth = getAuth();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let data = useSelector((state) => state);
  let [friendReq, setFriendReq] = useState([]);
  let [friends, setFriends] = useState([]);

  // modal:
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [loader, setLoader] = useState(false);
  let [show, setShow] = useState(false);

  // croper start
  const [image, setImage] = useState();
  const [cropper, setCropper] = useState();

  useEffect(() => {
    const friendRequestRef = databaseRef(db, "friendRequest/");
    onValue(friendRequestRef, (snapshot) => {
      let senderArr = [];

      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid === item.val().senderId) {
          senderArr.push({ ...item.val(), id: item.key });
        }
      });

      setFriendReq(senderArr);
    });

    const friendsRef = databaseRef(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let friendsArr = [];

      snapshot.forEach((item) => {
        if (
          data.userData.userInfo.uid === item.val().senderId ||
          data.userData.userInfo.uid === item.val().receiverId
        ) {
          friendsArr.push({ ...item.val(), id: item.key });
        }
      });

      setFriends(friendsArr);
    });
  }, []);

  const onChange = (e) => {
    setShow(true);
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
    setLoader(true);

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
        setLoader(false);
        setShow(false);

        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              update(databaseRef(db, "users/" + data.userData.userInfo.uid), {
                photoURL: downloadURL,
              })
                .then(() => {
                  // "Updated" photoURL added on the "Friend Request" Area
                  friendReq.map((item) => {
                    update(databaseRef(db, "friendRequest/" + item.id), {
                      senderPhoto: downloadURL,
                    })
                      .then(() => {
                        console.log(
                          "Photo updated on 'Friend Request' Area of Home page..!"
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  });

                  // "Updated" photoURL added on the "Friends" Area
                  friends.map((item) => {
                    if (data.userData.userInfo.uid === item.senderId) {
                      update(databaseRef(db, "friends/" + item.id), {
                        senderPhoto: downloadURL,
                      }).then(() => {
                        console.log("Sender photo updated");
                      });
                    } else if (data.userData.userInfo.uid === item.receiverId) {
                      update(databaseRef(db, "friends/" + item.id), {
                        receiverPhoto: downloadURL,
                      }).then(() => {
                        console.log("Receiver photo updated");
                      });
                    }
                  });
                })
                .catch((error) => {
                  console.log(error);
                });

              dispatch(activeUser(auth.currentUser));
              localStorage.setItem(
                "userInfo",
                JSON.stringify(auth.currentUser)
              );

              toast("Updated Profile Picture");
            })
            .catch((error) => {
              console.log(error);
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
        <ToastContainer />
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
                {data.userData.userInfo && data.userData.userInfo.photoURL ? (
                  <Image
                    onClick={handleOpen}
                    className="profile__img"
                    imageSource={data.userData.userInfo.photoURL}
                    alt="Profile Img"
                  />
                ) : (
                  <Avatar
                    onClick={handleOpen}
                    sx={{ width: "100%", height: "100%" }}
                    className="profile__img"
                  />
                )}
              </div>
              <h4 className="user__name">
                {data.userData.userInfo && data.userData.userInfo.displayName}
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
                  ) : data.userData.userInfo &&
                    data.userData.userInfo.photoURL ? (
                    <div className="image__holder">
                      <Image
                        className="profile__img cursorLess__profile__img"
                        imageSource={data.userData.userInfo.photoURL}
                        alt="UserProfile Img"
                      />
                    </div>
                  ) : (
                    <div className="image__holder">
                      <Avatar
                        sx={{ width: "100%", height: "100%" }}
                        className="profile__img"
                      />
                    </div>
                  )}
                </div>
                <div className="modal__input__box">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {show ? (
                      loader ? (
                        <ColorRing
                          visible={true}
                          height="42"
                          width="42"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
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
                          variant="contained"
                          component="label"
                          size="small"
                        >
                          Upload
                        </Button>
                      )
                    ) : (
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
                    )}
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
