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
  Avatar,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "./message.css";
import ProfileContentHeading from "../../components/ProfileContentHeading";
import { TbSend } from "react-icons/tb";
import { BsEmojiSmile, BsFillReplyFill, BsImage } from "react-icons/bs";
// import { AiFillAudio } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import { CgClose } from "react-icons/cg";
import { VscFileMedia } from "react-icons/vsc";
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
  uploadString,
} from "firebase/storage";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ForwardMessage from "../../components/ForwardMessage";
import Image from "../../components/Image";
import { ColorRing } from "react-loader-spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import EmojiPicker from "emoji-picker-react";

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
  let [dataUri, setDataUri] = useState("");
  let [cameraOpen, setCameraOpen] = useState(false);

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
  let [groupMsgList, setGroupMsgList] = useState([]);
  let [sms, setSms] = useState("");
  let [errorMsg, setErrorMsg] = useState("");
  let [selectedPhotoURL, setSelectedPhotoURL] = useState("");
  let [loadImage, setLoadImage] = useState("");
  let [audio, setAudio] = useState("");
  let [audioURL, setAudioURL] = useState("");
  let [showEmoji, setShowEmoji] = useState(false);

  let handleSubmit = () => {
    let smsRegex = /^\s+$/;

    if (sms.match(smsRegex)) {
      setErrorMsg("Empty Message..!");
    } else if (!sms) {
      setErrorMsg("Message Required..!");
    } else if (data.activeChat.focusedItem.status === "single") {
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
          update(ref(db, "friends/" + data.activeChat.focusedItem.id), {
            lastMsg: sms,
          })
            .then(() => {
              setSms("");
            })
            .catch((error) => {
              console.log(error.code);
            });
        })
        .catch((error) => {
          console.log(error.code);
        });
    } else if (data.activeChat.focusedItem.status === "group") {
      set(push(ref(db, "groupMsg/")), {
        whoSendName: data.userData.userInfo.displayName,
        whoSendId: data.userData.userInfo.uid,
        whoSendPhoto: data.activeChat.focusedItem
          ? data.activeChat.focusedItem.as === "member"
            ? data.activeChat.focusedItem.memberPhoto
              ? data.activeChat.focusedItem.memberPhoto
              : "memberPhoto__missing"
            : data.activeChat.focusedItem.adminPhoto ===
              "missing__admin__photoURL"
            ? "adminPhoto__missing"
            : data.activeChat.focusedItem.adminPhoto
          : "",
        whoReceiveName: data.activeChat.focusedItem
          ? data.activeChat.focusedItem.groupName
          : "",
        whoReceiveId: data.activeChat.focusedItem
          ? data.activeChat.focusedItem.groupId
            ? data.activeChat.focusedItem.groupId
            : data.activeChat.focusedItem.id
          : "",
        msg: sms,
        ...(data.activeChat.focusedItem &&
          data.activeChat.focusedItem.as === "member" && {
            senderAs: "member",
          }),
        ...(data.activeChat.focusedItem &&
          data.activeChat.focusedItem.as === "admin" && {
            senderAs: "admin",
          }),
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

    const groupMsgRef = ref(db, "groupMsg");
    onValue(groupMsgRef, (snapshot) => {
      let groupMsg = [];

      let clickedGroupId = data.activeChat.focusedItem
        ? data.activeChat.focusedItem.groupId
          ? data.activeChat.focusedItem.groupId
          : data.activeChat.focusedItem.id
        : "";

      snapshot.forEach((item) => {
        if (item.val().whoReceiveId === clickedGroupId) {
          groupMsg.push({ ...item.val(), id: item.key });
        }
      });

      setGroupMsgList(groupMsg);
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

    if (data.activeChat.focusedItem.status === "single") {
      let { id, ...rest } = selectItem;

      if (selectItem.msg) {
        update(ref(db, "singleMsg/" + id), {
          ...rest,
          msg: "removed",
          removedById: data.userData.userInfo.uid,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
        })
          .then(() => {
            update(ref(db, "friends/" + data.activeChat.focusedItem.id), {
              lastMsg: "Removed Message",
            })
              .then(() => {
                toast("Message has been removed");
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      } else if (selectItem.img) {
        update(ref(db, "singleMsg/" + id), {
          ...rest,
          img: "removed",
          imgRef: "deleted",
          removedById: data.userData.userInfo.uid,
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
                update(ref(db, "friends/" + data.activeChat.focusedItem.id), {
                  lastMsg: "Removed Image",
                })
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
          })
          .catch((error) => {
            console.log(error.code);
          });
      } else if (selectItem.audio) {
        update(ref(db, "singleMsg/" + id), {
          ...rest,
          audio: "removed",
          audioRef: "deleted",
          removedById: data.userData.userInfo.uid,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
        })
          .then(() => {
            const audioMsgRef = storeRef(
              storage,
              "audioMessage/" + selectItem.audioRef
            );
            deleteObject(audioMsgRef)
              .then(() => {
                update(ref(db, "friends/" + data.activeChat.focusedItem.id), {
                  lastMsg: "Removed Audio",
                })
                  .then(() => {
                    toast("Audio has been removed");
                  })
                  .catch((error) => {
                    console.log(error.code);
                  });
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      }
    } else if (data.activeChat.focusedItem.status === "group") {
      if (selectItem.msg) {
        update(ref(db, "groupMsg/" + selectItem.id), {
          msg: "removed",
          removedById: data.userData.userInfo.uid,
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
        update(ref(db, "groupMsg/" + selectItem.id), {
          img: "removed",
          imgRef: "deleted",
          removedById: data.userData.userInfo.uid,
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
      } else if (selectItem.audio) {
        update(ref(db, "groupMsg/" + selectItem.id), {
          audio: "removed",
          audioRef: "deleted",
          removedById: data.userData.userInfo.uid,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
        })
          .then(() => {
            const audioMsgRef = storeRef(
              storage,
              "audioMessage/" + selectItem.audioRef
            );
            deleteObject(audioMsgRef)
              .then(() => {
                toast("Audio has been removed");
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      }
    }
  };

  let handleForwardMsg = () => {
    setAnchorEl(null);
    setOpenModal(true);
  };

  let handleKeyUp = (e) => {
    let smsRegex = /^\s+$/;

    if (e.key === "Enter") {
      if (sms.match(smsRegex)) {
        setErrorMsg("Empty Message..!");
      } else if (!sms) {
        setErrorMsg("Message Required..!");
      } else if (data.activeChat.focusedItem.status === "single") {
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
            update(ref(db, "friends/" + data.activeChat.focusedItem.id), {
              lastMsg: sms,
            })
              .then(() => {
                setSms("");
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      } else if (data.activeChat.focusedItem.status === "group") {
        set(push(ref(db, "groupMsg/")), {
          whoSendName: data.userData.userInfo.displayName,
          whoSendId: data.userData.userInfo.uid,
          whoSendPhoto: data.activeChat.focusedItem
            ? data.activeChat.focusedItem.as === "member"
              ? data.activeChat.focusedItem.memberPhoto
                ? data.activeChat.focusedItem.memberPhoto
                : "memberPhoto__missing"
              : data.activeChat.focusedItem.adminPhoto ===
                "missing__admin__photoURL"
              ? "adminPhoto__missing"
              : data.activeChat.focusedItem.adminPhoto
            : "",
          whoReceiveName: data.activeChat.focusedItem
            ? data.activeChat.focusedItem.groupName
            : "",
          whoReceiveId: data.activeChat.focusedItem
            ? data.activeChat.focusedItem.groupId
              ? data.activeChat.focusedItem.groupId
              : data.activeChat.focusedItem.id
            : "",
          msg: sms,
          ...(data.activeChat.focusedItem &&
            data.activeChat.focusedItem.as === "member" && {
              senderAs: "member",
            }),
          ...(data.activeChat.focusedItem &&
            data.activeChat.focusedItem.as === "admin" && {
              senderAs: "admin",
            }),
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

  let handleLoadPhotoByFile = (e) => {
    const [file] = e.target.files;

    if (file) {
      setSelectedPhotoURL(URL.createObjectURL(file));
    }

    setLoadImage(e.target.files[0]);
  };

  let handleSendPhotoByFile = () => {
    setLoading(true);

    if (data.activeChat.focusedItem.status === "single") {
      const storageRef = storeRef(storage, "photoMessage/" + uuid);

      uploadBytes(storageRef, loadImage).then((snapshot) => {
        getDownloadURL(storageRef)
          .then((downloadURL) => {
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
              imgRef: uuid,
              date: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
            })
              .then(() => {
                update(ref(db, "friends/" + data.activeChat.focusedItem.id), {
                  lastMsg: "Sent an Image",
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
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      });
    } else if (data.activeChat.focusedItem.status === "group") {
      const storageRef = storeRef(storage, "groupPhotoMessage/" + uuid);

      uploadBytes(storageRef, loadImage).then((snapshot) => {
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            set(push(ref(db, "groupMsg/")), {
              whoSendName: data.userData.userInfo.displayName,
              whoSendId: data.userData.userInfo.uid,
              whoSendPhoto: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.as === "member"
                  ? data.activeChat.focusedItem.memberPhoto
                    ? data.activeChat.focusedItem.memberPhoto
                    : "memberPhoto__missing"
                  : data.activeChat.focusedItem.adminPhoto ===
                    "missing__admin__photoURL"
                  ? "adminPhoto__missing"
                  : data.activeChat.focusedItem.adminPhoto
                : "",
              whoReceiveName: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.groupName
                : "",
              whoReceiveId: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.groupId
                  ? data.activeChat.focusedItem.groupId
                  : data.activeChat.focusedItem.id
                : "",
              img: downloadURL,
              imgRef: uuid,
              ...(data.activeChat.focusedItem &&
                data.activeChat.focusedItem.as === "member" && {
                  senderAs: "member",
                }),
              ...(data.activeChat.focusedItem &&
                data.activeChat.focusedItem.as === "admin" && {
                  senderAs: "admin",
                }),
              date: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
            })
              .then(() => {
                setSms("");
                setSelectedPhotoURL("");
                setShow(false);
                setLoading(false);
                toast(
                  `image sent to ${
                    data.activeChat.focusedItem &&
                    data.activeChat.focusedItem.groupName
                  }`
                );
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      });
    }
  };

  let handleTakePhoto = (dataUri) => {
    setDataUri(dataUri);
    setShow(true);
    setCameraOpen(false);
  };

  let handleSendPhotoByCamera = () => {
    setLoading(true);

    if (data.activeChat.focusedItem.status === "single") {
      const storageRef = storeRef(storage, "photoMessage/" + uuid);
      const message4 = dataUri;

      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef)
          .then((downloadURL) => {
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
              imgRef: uuid,
              date: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
            })
              .then(() => {
                update(ref(db, "friends/" + data.activeChat.focusedItem.id), {
                  lastMsg: "Sent an Image",
                })
                  .then(() => {
                    setCameraOpen(false);
                    setSms("");
                    setDataUri("");
                    setShow(false);
                    setLoading(false);
                    toast(`image sent to ${clickedName}`);
                  })
                  .catch((error) => {
                    console.log(error.code);
                  });
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      });
    } else if (data.activeChat.focusedItem.status === "group") {
      const storageRef = storeRef(storage, "groupPhotoMessage/" + uuid);
      const message4 = dataUri;

      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            set(push(ref(db, "groupMsg/")), {
              whoSendName: data.userData.userInfo.displayName,
              whoSendId: data.userData.userInfo.uid,
              whoSendPhoto: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.as === "member"
                  ? data.activeChat.focusedItem.memberPhoto
                    ? data.activeChat.focusedItem.memberPhoto
                    : "memberPhoto__missing"
                  : data.activeChat.focusedItem.adminPhoto ===
                    "missing__admin__photoURL"
                  ? "adminPhoto__missing"
                  : data.activeChat.focusedItem.adminPhoto
                : "",
              whoReceiveName: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.groupName
                : "",
              whoReceiveId: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.groupId
                  ? data.activeChat.focusedItem.groupId
                  : data.activeChat.focusedItem.id
                : "",
              img: downloadURL,
              imgRef: uuid,
              ...(data.activeChat.focusedItem &&
                data.activeChat.focusedItem.as === "member" && {
                  senderAs: "member",
                }),
              ...(data.activeChat.focusedItem &&
                data.activeChat.focusedItem.as === "admin" && {
                  senderAs: "admin",
                }),
              date: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
            })
              .then(() => {
                setCameraOpen(false);
                setDataUri("");
                setSelectedPhotoURL("");
                setSms("");
                setShow(false);
                setLoading(false);
                toast(
                  `image sent to ${
                    data.activeChat.focusedItem &&
                    data.activeChat.focusedItem.groupName
                  }`
                );
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      });
    }
  };

  // Audio functionality start
  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    setAudio(audio);
    setAudioURL(blob);
  };

  let handleAudioClick = () => {
    setShow(true);
    setSelectedPhotoURL("");
    setDataUri("");
  };

  let handleSendAudio = () => {
    setLoading(true);

    if (data.activeChat.focusedItem.status === "single") {
      const storageRef = storeRef(storage, "audioMessage/" + uuid);

      uploadBytes(storageRef, audioURL).then((snapshot) => {
        getDownloadURL(storageRef)
          .then((downloadURL) => {
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
              audio: downloadURL,
              audioRef: uuid,
              date: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
            })
              .then(() => {
                update(ref(db, "friends/" + data.activeChat.focusedItem.id), {
                  lastMsg: "Sent an Audio",
                })
                  .then(() => {
                    setSms("");
                    setSelectedPhotoURL("");
                    setDataUri("");
                    setAudio("");
                    setAudioURL("");
                    setShow(false);
                    setLoading(false);
                    toast(`audio sent to ${clickedName}`);
                  })
                  .catch((error) => {
                    console.log(error.code);
                  });
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      });
    } else if (data.activeChat.focusedItem.status === "group") {
      const storageRef = storeRef(storage, "groupAudioMessage/" + uuid);

      uploadBytes(storageRef, audioURL).then((snapshot) => {
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            set(push(ref(db, "groupMsg/")), {
              whoSendName: data.userData.userInfo.displayName,
              whoSendId: data.userData.userInfo.uid,
              whoSendPhoto: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.as === "member"
                  ? data.activeChat.focusedItem.memberPhoto
                    ? data.activeChat.focusedItem.memberPhoto
                    : "memberPhoto__missing"
                  : data.activeChat.focusedItem.adminPhoto ===
                    "missing__admin__photoURL"
                  ? "adminPhoto__missing"
                  : data.activeChat.focusedItem.adminPhoto
                : "",
              whoReceiveName: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.groupName
                : "",
              whoReceiveId: data.activeChat.focusedItem
                ? data.activeChat.focusedItem.groupId
                  ? data.activeChat.focusedItem.groupId
                  : data.activeChat.focusedItem.id
                : "",
              audio: downloadURL,
              audioRef: uuid,
              ...(data.activeChat.focusedItem &&
                data.activeChat.focusedItem.as === "member" && {
                  senderAs: "member",
                }),
              ...(data.activeChat.focusedItem &&
                data.activeChat.focusedItem.as === "admin" && {
                  senderAs: "admin",
                }),
              date: `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
            })
              .then(() => {
                setSms("");
                setSelectedPhotoURL("");
                setDataUri("");
                setAudio("");
                setAudioURL("");
                setShow(false);
                setLoading(false);
                toast(
                  `audio sent to ${
                    data.activeChat.focusedItem &&
                    data.activeChat.focusedItem.groupName
                  }`
                );
              })
              .catch((error) => {
                console.log(error.code);
              });
          })
          .catch((error) => {
            console.log(error.code);
          });
      });
    }
  };
  // Audio functionality end

  let handleSendEmoji = (e) => {
    setSms(sms + e.emoji);
    setShowEmoji(false);
  };

  return (
    <>
      <Grid container sx={{ postion: "relative" }} columnSpacing={2}>
        {cameraOpen && (
          <div className="camera__container">
            <Camera
              onTakePhoto={(dataUri) => {
                handleTakePhoto(dataUri);
              }}
              idealResolution={{ width: 640, height: 480 }}
              imageCompression={0.97}
              isMaxResolution={true}
              isImageMirror={false}
              isSilentMode={false}
              isDisplayStartCameraError={true}
              isFullscreen={true}
              sizeFactor={1}
            />

            <IconButton
              color="primary"
              component="label"
              title="close"
              onClick={() => setCameraOpen(false)}
              sx={{
                position: "absolute",
                top: "50px",
                right: "50px",
                fontSize: "40px",
              }}
            >
              <CgClose />
            </IconButton>
          </div>
        )}
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
                    ? data.activeChat.focusedItem.status === "single"
                      ? data.userData.userInfo.uid ===
                        data.activeChat.focusedItem.senderId
                        ? data.activeChat.focusedItem.receiverName
                        : data.activeChat.focusedItem.senderName
                      : data.activeChat.focusedItem.groupName
                    : "Default Name"
                }
                photoURL={
                  data.activeChat.focusedItem
                    ? data.activeChat.focusedItem.status === "single"
                      ? data.userData.userInfo.uid ===
                        data.activeChat.focusedItem.senderId
                        ? data.activeChat.focusedItem.receiverPhoto
                        : data.activeChat.focusedItem.senderPhoto
                      : data.activeChat.focusedItem.groupPhotoURL
                      ? data.activeChat.focusedItem.groupPhotoURL
                      : data.activeChat.focusedItem.groupPhoto
                    : ""
                }
              />
              <Divider />

              <div className="chat__box">
                {data.activeChat.focusedItem.status === "single" ? (
                  <>
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
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
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
                                  image removed by{" "}
                                  {item.removedById === item.whoSendId
                                    ? item.whoSendName
                                    : item.whoReceiveName}
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
                        ) : item.audio ? (
                          <div className="sender sender__img__sms" key={index}>
                            <div className="msg__wrapper sender__wrapper">
                              {item.audio !== "removed" ? (
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
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
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
                                    <audio src={item.audio} controls />
                                  </div>
                                </>
                              ) : (
                                <div className="chat remove__msg">
                                  audio removed by{" "}
                                  {item.removedById === item.whoSendId
                                    ? item.whoSendName
                                    : item.whoReceiveName}
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
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
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
                                  removed message by{" "}
                                  {item.removedById === item.whoSendId
                                    ? item.whoSendName
                                    : item.whoReceiveName}
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
                        <div
                          className="receiver  receiver__img__sms"
                          key={index}
                        >
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
                                  <BsFillReplyFill
                                    className="reply__icon"
                                    title="reply"
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="chat remove__msg">
                                image removed by{" "}
                                {item.removedById === item.whoSendId
                                  ? item.whoSendName
                                  : item.whoReceiveName}
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
                      ) : item.audio ? (
                        <div
                          className="receiver  receiver__img__sms"
                          key={index}
                        >
                          <div className="msg__wrapper  receiver__wrapper">
                            {item.audio !== "removed" ? (
                              <>
                                <div className="receiver__img__box">
                                  <audio src={item.audio} controls />
                                </div>
                                <div className="msg__action">
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
                                  <BsFillReplyFill
                                    className="reply__icon"
                                    title="reply"
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="chat remove__msg">
                                audio removed by{" "}
                                {item.removedById === item.whoSendId
                                  ? item.whoSendName
                                  : item.whoReceiveName}
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
                                  <BsFillReplyFill
                                    className="reply__icon"
                                    title="reply"
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="chat remove__msg">
                                removed message by{" "}
                                {item.removedById === item.whoSendId
                                  ? item.whoSendName
                                  : item.whoReceiveName}
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
                  </>
                ) : (
                  <>
                    {groupMsgList.map((item, index) =>
                      item.whoSendId === data.userData.userInfo.uid ? (
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
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
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
                        ) : item.audio ? (
                          <div className="sender sender__img__sms" key={index}>
                            <div className="msg__wrapper sender__wrapper">
                              {item.audio !== "removed" ? (
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
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
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
                                    <audio src={item.audio} controls />
                                  </div>
                                </>
                              ) : (
                                <div className="chat remove__msg">
                                  audio has been removed
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
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
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
                        <div
                          className="receiver  receiver__img__sms"
                          key={index}
                        >
                          <div className="msg__wrapper  receiver__wrapper">
                            {item.img !== "removed" ? (
                              <>
                                <div
                                  className="group__receiver__img__box"
                                  title={
                                    item.whoSendName + ` (${item.senderAs})`
                                  }
                                >
                                  {item.whoSendPhoto ===
                                    "memberPhoto__missing" ||
                                  item.whoSendPhoto ===
                                    "adminPhoto__missing" ? (
                                    <Avatar
                                      sx={{ width: "100%", height: "100%" }}
                                      src="/broken-image.jpg"
                                    />
                                  ) : (
                                    <Image
                                      className="group__receiver__img"
                                      imageSource={item.whoSendPhoto}
                                    />
                                  )}
                                </div>
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
                      ) : item.audio ? (
                        <div
                          className="receiver  receiver__img__sms"
                          key={index}
                        >
                          <div className="msg__wrapper  receiver__wrapper">
                            {item.audio !== "removed" ? (
                              <>
                                <div
                                  className="group__receiver__img__box  self__center"
                                  title={
                                    item.whoSendName + ` (${item.senderAs})`
                                  }
                                >
                                  {item.whoSendPhoto ===
                                    "memberPhoto__missing" ||
                                  item.whoSendPhoto ===
                                    "adminPhoto__missing" ? (
                                    <Avatar
                                      sx={{ width: "100%", height: "100%" }}
                                      src="/broken-image.jpg"
                                    />
                                  ) : (
                                    <Image
                                      className="group__receiver__img"
                                      imageSource={item.whoSendPhoto}
                                    />
                                  )}
                                </div>
                                <div className="receiver__img__box">
                                  <audio src={item.audio} controls />
                                </div>
                                <div className="msg__action">
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
                                  <BsFillReplyFill
                                    className="reply__icon"
                                    title="reply"
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="chat remove__msg">
                                audio has been removed
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
                                <div
                                  className="group__receiver__img__box"
                                  title={
                                    item.whoSendName + ` (${item.senderAs})`
                                  }
                                >
                                  {item.whoSendPhoto ===
                                    "memberPhoto__missing" ||
                                  item.whoSendPhoto ===
                                    "adminPhoto__missing" ? (
                                    <Avatar
                                      sx={{ width: "100%", height: "100%" }}
                                      src="/broken-image.jpg"
                                    />
                                  ) : (
                                    <Image
                                      className="group__receiver__img"
                                      imageSource={item.whoSendPhoto}
                                    />
                                  )}
                                </div>
                                <div className="chat receiver__chat">
                                  {item.msg}
                                </div>
                                <div className="msg__action">
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
                  </>
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
                              setDataUri("");
                            }}
                          >
                            <RxCross2 />
                          </IconButton>
                        </div>

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
                          <Button
                            onClick={handleSendPhotoByFile}
                            variant="contained"
                            title="send image"
                          >
                            send
                          </Button>
                        )}

                        {/* =========== image preview end ============= */}
                      </>
                    ) : dataUri ? (
                      <>
                        {/* =========== image preview start ============= */}
                        <div className="preview__img__container">
                          <Image
                            className="preview__img"
                            imageSource={dataUri}
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
                              setDataUri("");
                            }}
                          >
                            <RxCross2 />
                          </IconButton>
                        </div>

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
                          <Button
                            onClick={handleSendPhotoByCamera}
                            variant="contained"
                            title="send image"
                          >
                            Send
                          </Button>
                        )}

                        {/* =========== image preview end ============= */}
                      </>
                    ) : audio ? (
                      <>
                        <div className="audio__preview__wrapper">
                          <audio src={audio.src} controls={audio.controls} />
                          <IconButton
                            color="primary"
                            component="label"
                            title="close"
                            onClick={() => {
                              setShow(false);
                              setSelectedPhotoURL("");
                              setDataUri("");
                              setAudio("");
                            }}
                          >
                            <RxCross2 />
                          </IconButton>
                        </div>
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
                          <Button
                            onClick={handleSendAudio}
                            variant="contained"
                            title="send audio"
                          >
                            <GiSoundWaves className="send__icon" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="preview__img__container">
                        <VscFileMedia className="avatar__img" />

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
                            setDataUri("");
                          }}
                        >
                          <RxCross2 />
                        </IconButton>
                      </div>
                    )
                  ) : (
                    <>
                      <TextField
                        error={errorMsg ? true : false}
                        placeholder="type message"
                        size="small"
                        multiline={false}
                        name="sms"
                        onChange={(e) => {
                          setSms(e.target.value);
                          setErrorMsg("");
                        }}
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
                    {showEmoji && (
                      <EmojiPicker
                        onEmojiClick={(emoji) => handleSendEmoji(emoji)}
                      />
                    )}
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      title="emoji"
                      onClick={() => setShowEmoji(!showEmoji)}
                    >
                      <BsEmojiSmile className="emoji__icon" />
                    </IconButton>
                    {/* {showEmoji && (
                      <EmojiPicker
                        onEmojiClick={(emoji) => handleSendEmoji(emoji)}
                      />
                    )} */}

                    {/* <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      title="voice"
                    >
                      <AiFillAudio />
                    </IconButton> */}
                    <div onClick={handleAudioClick}>
                      <AudioRecorder
                        onRecordingComplete={(blob) => addAudioElement(blob)}
                        recorderControls={recorderControls}
                      />
                    </div>

                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      title="camera"
                      onClick={() => {
                        setCameraOpen(true);
                        setSelectedPhotoURL("");
                        setAudio("");
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>

                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      title="image"
                      onClick={() => {
                        setShow(true);
                        setDataUri("");
                        setAudio("");
                      }}
                    >
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        name="photo"
                        onChange={handleLoadPhotoByFile}
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
