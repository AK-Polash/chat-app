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
  Backdrop,
  Modal,
  Fade,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "./message.css";
import ProfileContentHeading from "../../components/ProfileContentHeading";
import { TbSend } from "react-icons/tb";
import { BsEmojiSmile, BsFillReplyFill, BsImage } from "react-icons/bs";
import { AiFillAudio } from "react-icons/ai";
import { MdOutlinePhotoSizeSelectLarge } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import {
  set,
  push,
  ref,
  getDatabase,
  onValue,
  update,
} from "firebase/database";
import {
  getStorage,
  ref as storeRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ForwardMessage from "../../components/ForwardMessage";
import Image from "../../components/Image";
import { ColorRing } from "react-loader-spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Message = () => {
  let [selectItem, setSelectItem] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Modal:
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  let [show, setShow] = useState(false);
  let [loading, setLoading] = useState(false);

  let data = useSelector((state) => state);
  let db = getDatabase();
  let storage = getStorage();
  let uuid = uuidv4();
  let clickedName = data.activeChat.focusedItem
    ? data.activeChat.focusedItem.senderId === data.userData.userInfo.uid
      ? data.activeChat.focusedItem.receiverName
      : data.activeChat.focusedItem.senderName
    : "";

  let [msgList, setMsgList] = useState([]);
  let [sms, setSms] = useState("");
  let [selectedPhotoURL, setSelectedPhotoURL] = useState("");
  let [uploadImage, setUploadImage] = useState("");

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
        msg: sms,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
      })
        .then(() => {
          setSms("");
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

  let handleRemoveMsg = () => {
    setAnchorEl(null);
    let { id, ...rest } = selectItem;

    if (selectItem.msg) {
      update(ref(db, "singleMsg/" + id), {
        ...rest,
        msg: "removed",
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
      })
        .then(() => {
          toast("Message has been removed");
        })
        .catch((error) => {
          console.log(error.code);
        });
    } else if (selectItem.img) {
      update(ref(db, "singleMsg/" + id), {
        ...rest,
        img: "removed",
        imgRef: "deleted",
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
      })
        .then(() => {
          const photoMsgRef = storeRef(
            storage,
            "photoMessage/" + selectItem.imgRef
          );
          deleteObject(photoMsgRef)
            .then(() => {
              toast("Image has been removed");
            })
            .catch((error) => {
              console.log(error.code);
            });
        })
        .catch((error) => {
          console.log(error.code);
        });
    }
  };

  let handleForwardMsg = () => {
    setAnchorEl(null);
    setOpenModal(true);
  };

  let handleKeyUp = (e) => {
    if (e.key === "Enter") {
      if (data.activeChat.focusedItem.status === "single") {
        set(push(ref(db, "singleMsg/")), {
          whoSendName: data.userData.userInfo.displayName,
          whoSendId: data.userData.userInfo.uid,
          whoReceiveName: data.activeChat.focusedItem
            ? data.userData.userInfo.uid ===
              data.activeChat.focusedItem.senderId
              ? data.activeChat.focusedItem.receiverName
              : data.activeChat.focusedItem.senderName
            : "",
          whoReceiveId: data.activeChat.focusedItem
            ? data.userData.userInfo.uid ===
              data.activeChat.focusedItem.senderId
              ? data.activeChat.focusedItem.receiverId
              : data.activeChat.focusedItem.senderId
            : "",
          msg: sms,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
        })
          .then(() => {
            setSms("");
          })
          .catch((error) => {
            console.log(error.code);
          });
      }
    }
  };

  let handlePreviewImage = (e) => {
    const [file] = e.target.files;

    if (file) {
      setSelectedPhotoURL(URL.createObjectURL(file));
    }

    setUploadImage(e.target.files[0]);
  };

  let handleImageUpload = () => {
    setLoading(true);

    const storageRef = storeRef(
      storage,
      "photoMessage/" + uuid + uploadImage.name
    );

    uploadBytes(storageRef, uploadImage).then((snapshot) => {
      getDownloadURL(storageRef)
        .then((downloadURL) => {
          if (data.activeChat.focusedItem.status === "single") {
            set(push(ref(db, "singleMsg/")), {
              whoSendName: data.userData.userInfo.displayName,
              whoSendId: data.userData.userInfo.uid,
              whoReceiveName: data.activeChat.focusedItem
                ? data.userData.userInfo.uid ===
                  data.activeChat.focusedItem.senderId
                  ? data.activeChat.focusedItem.receiverName
                  : data.activeChat.focusedItem.senderName
                : "",
              whoReceiveId: data.activeChat.focusedItem
                ? data.userData.userInfo.uid ===
                  data.activeChat.focusedItem.senderId
                  ? data.activeChat.focusedItem.receiverId
                  : data.activeChat.focusedItem.senderId
                : "",
              img: downloadURL,
              imgRef: uuid + uploadImage.name,
              date: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
            })
              .then(() => {
                setSms("");
                setSelectedPhotoURL("");
                setShow(false);
                setLoading(false);
                toast(`image sent to ${clickedName}`);
              })
              .catch((error) => {
                console.log(error.code);
              });
          }
        })
        .catch((error) => {
          console.log(error.code);
        });
    });
  };

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
                    item.img ? (
                      <div className="sender sender__img__sms" key={index}>
                        <div className="msg__wrapper sender__wrapper">
                          {item.img !== "removed" ? (
                            <>
                              <div className="msg__action">
                                <BsFillReplyFill
                                  className="reply__icon"
                                  title="reply"
                                />
                                <div>
                                  <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={
                                      open ? "long-menu" : undefined
                                    }
                                    aria-expanded={open ? "true" : undefined}
                                    aria-haspopup="true"
                                    onClick={(e) => {
                                      setAnchorEl(e.currentTarget);
                                      setSelectItem(item);
                                    }}
                                    title="more"
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                  <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                  >
                                    <MenuItem onClick={handleRemoveMsg}>
                                      Remove
                                    </MenuItem>
                                    <MenuItem onClick={handleForwardMsg}>
                                      Forward
                                    </MenuItem>
                                  </Menu>
                                </div>
                              </div>
                              <div className="sender__img__box">
                                <Image
                                  className="chat__img"
                                  imageSource={item.img}
                                  alt="photo sms"
                                  loading="lazy"
                                />
                              </div>
                            </>
                          ) : (
                            <div className="chat remove__msg">
                              image has been removed
                            </div>
                          )}
                        </div>
                        <div
                          className="chat__moment  chat__moment__sender"
                          ref={messagesEndRef}
                        >
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </div>
                      </div>
                    ) : (
                      <div className="sender" key={index}>
                        <div className="msg__wrapper">
                          {item.msg !== "removed" ? (
                            <>
                              <div className="msg__action">
                                <BsFillReplyFill
                                  className="reply__icon"
                                  title="reply"
                                />
                                <div>
                                  <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={
                                      open ? "long-menu" : undefined
                                    }
                                    aria-expanded={open ? "true" : undefined}
                                    aria-haspopup="true"
                                    onClick={(e) => {
                                      setAnchorEl(e.currentTarget);
                                      setSelectItem(item);
                                    }}
                                    title="more"
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                  <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                  >
                                    <MenuItem onClick={handleRemoveMsg}>
                                      Remove
                                    </MenuItem>
                                    <MenuItem onClick={handleForwardMsg}>
                                      Forward
                                    </MenuItem>
                                  </Menu>
                                </div>
                              </div>
                              <div className="chat sender__chat">
                                {item.msg}
                              </div>
                            </>
                          ) : (
                            <div className="chat remove__msg">
                              message has been removed
                            </div>
                          )}
                        </div>
                        <div
                          className="chat__moment chat__moment__sender"
                          ref={messagesEndRef}
                        >
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </div>
                      </div>
                    )
                  ) : item.img ? (
                    <div className="receiver  receiver__img__sms" key={index}>
                      <div className="msg__wrapper  receiver__wrapper">
                        {item.img !== "removed" ? (
                          <>
                            <div className="receiver__img__box">
                              <Image
                                className="chat__img"
                                imageSource={item.img}
                                alt="photo sms"
                                loading="lazy"
                              />
                            </div>
                            <div className="msg__action">
                              <div>
                                <IconButton
                                  aria-label="more"
                                  id="long-button"
                                  aria-controls={open ? "long-menu" : undefined}
                                  aria-expanded={open ? "true" : undefined}
                                  aria-haspopup="true"
                                  onClick={(e) => {
                                    setAnchorEl(e.currentTarget);
                                    setSelectItem(item);
                                  }}
                                  title="more"
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                >
                                  <MenuItem onClick={handleRemoveMsg}>
                                    Remove
                                  </MenuItem>
                                  <MenuItem onClick={handleForwardMsg}>
                                    Forward
                                  </MenuItem>
                                </Menu>
                              </div>
                              <BsFillReplyFill
                                className="reply__icon"
                                title="reply"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="chat remove__msg">
                            image has been removed
                          </div>
                        )}
                      </div>

                      <div
                        className="chat__moment chat__moment__receiver"
                        ref={messagesEndRef}
                      >
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </div>
                    </div>
                  ) : (
                    <div className="receiver" key={index}>
                      <div className="msg__wrapper">
                        {item.msg !== "removed" ? (
                          <>
                            <div className="chat receiver__chat">
                              {item.msg}
                            </div>
                            <div className="msg__action">
                              <div>
                                <IconButton
                                  aria-label="more"
                                  id="long-button"
                                  aria-controls={open ? "long-menu" : undefined}
                                  aria-expanded={open ? "true" : undefined}
                                  aria-haspopup="true"
                                  onClick={(e) => {
                                    setAnchorEl(e.currentTarget);
                                    setSelectItem(item);
                                  }}
                                  title="more"
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                >
                                  <MenuItem onClick={handleRemoveMsg}>
                                    Remove
                                  </MenuItem>
                                  <MenuItem onClick={handleForwardMsg}>
                                    Forward
                                  </MenuItem>
                                </Menu>
                              </div>
                              <BsFillReplyFill
                                className="reply__icon"
                                title="reply"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="chat remove__msg">
                            message has been removed
                          </div>
                        )}
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {show ? (
                    selectedPhotoURL ? (
                      <>
                        {/* =========== image preview start ============= */}
                        {loading ? (
                          <div className="preview__img__container">
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
                          </div>
                        ) : (
                          <div className="preview__img__container">
                            <Image
                              className="preview__img"
                              imageSource={selectedPhotoURL}
                              alt="preview img"
                              loading="lazy"
                            />

                            <IconButton
                              color="primary"
                              component="label"
                              title="close"
                              sx={{
                                alignSelf: "flex-start",
                              }}
                              onClick={() => {
                                setShow(false);
                                setSelectedPhotoURL("");
                              }}
                            >
                              <RxCross2 />
                            </IconButton>
                          </div>
                        )}

                        <Button onClick={handleImageUpload} variant="contained">
                          send
                        </Button>

                        {/* =========== image preview end ============= */}
                      </>
                    ) : (
                      <div className="preview__img__container">
                        <MdOutlinePhotoSizeSelectLarge className="avatar__img" />

                        <IconButton
                          color="primary"
                          component="label"
                          title="close"
                          sx={{
                            alignSelf: "flex-start",
                          }}
                          onClick={() => {
                            setShow(false);
                            setSelectedPhotoURL("");
                          }}
                        >
                          <RxCross2 />
                        </IconButton>
                      </div>
                    )
                  ) : (
                    <>
                      <TextField
                        placeholder="type message"
                        size="small"
                        multiline={false}
                        name="sms"
                        onChange={(e) => setSms(e.target.value)}
                        value={sms}
                        onKeyUp={handleKeyUp}
                        sx={{
                          width: "69%",
                          background: "#F1F1F1",
                        }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        <TbSend className="send__icon" />
                      </Button>
                    </>
                  )}

                  <div className="media__sms">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      title="emoji"
                    >
                      <BsEmojiSmile className="emoji__icon" />
                    </IconButton>

                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      title="voice"
                    >
                      <AiFillAudio />
                    </IconButton>

                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      title="camera"
                    >
                      <PhotoCamera />
                    </IconButton>

                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      title="image"
                      onClick={() => setShow(true)}
                    >
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        name="photo"
                        onChange={handlePreviewImage}
                      />

                      <BsImage className="file__icon" />
                    </IconButton>
                  </div>
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

          {/* ============================= Forward Modal start ================================== */}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 300,
              },
            }}
          >
            <Fade in={openModal}>
              <Box sx={style}>
                <ForwardMessage message={selectItem} />
              </Box>
            </Fade>
          </Modal>
          {/* ============================= Forward Modal end ================================== */}
        </Grid>
      </Grid>
    </>
  );
};

export default Message;
