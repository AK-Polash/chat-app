import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import { Alert, TextField } from "@mui/material/";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
} from "firebase/database";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ForwardMessage = ({ message }) => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [friends, setFriends] = useState([]);
  let [groups, setGroups] = useState([]);
  let [groupM, setGroupM] = useState([]);
  let [isSent, setIsSent] = useState([]);
  let [buttonChange, setButtonChange] = useState([]);
  let [searchArr, setSearchArr] = useState([]);
  let [attastGroup, setAttastGroup] = useState([]);
  let [allMyGroup, setAllMyGroup] = useState([]);
  let [loader, setLoader] = useState(false);

  useEffect(() => {
    const friendsRef = ref(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let friendsArr = [];

      snapshot.forEach((item) => {
        if (
          data.userData.userInfo.uid === item.val().receiverId ||
          data.userData.userInfo.uid === item.val().senderId
        ) {
          friendsArr.push({ ...item.val(), id: item.key });
        }
      });

      setFriends(friendsArr);
    });
  }, []);

  useEffect(() => {
    const groupRef = ref(db, "groups/");
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
    const groupMembersRef = ref(db, "groupMembers/");
    onValue(groupMembersRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid === item.val().memberId) {
          arr.push({ ...item.val(), id: item.key });
        }
      });

      setGroupM(arr);
    });
  }, []);

  useEffect(() => {
    let grp = [...groups, ...groupM];

    setAttastGroup(grp);
  }, [groupM]);

  let handleSendMsg = (msgItem) => {
    if (data.activeChat.focusedItem.status === "single") {
      set(push(ref(db, "singleMsg/")), {
        whoSendName: data.userData.userInfo.displayName,
        whoSendId: data.userData.userInfo.uid,
        whoReceiveName:
          data.userData.userInfo.uid === msgItem.senderId
            ? msgItem.receiverName
            : msgItem.senderName,
        whoReceiveId:
          data.userData.userInfo.uid === msgItem.senderId
            ? msgItem.receiverId
            : msgItem.senderId,
        ...(message.msg && { msg: message.msg }),
        ...(message.img && { img: message.img, imgRef: message.imgRef }),
        ...(message.audio && {
          audio: message.audio,
          audioRef: message.audioRef,
        }),
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
      }).then(() => {
        update(ref(db, "friends/" + msgItem.id), {
          lastMsg: message.msg
            ? message.msg
            : message.img
            ? "Sent an Image"
            : message.audio
            ? "Sent an Audio"
            : "",
        })
          .then(() => {
            setButtonChange(msgItem.senderId + msgItem.receiverId);
            toast(
              `Forwarded to ${
                data.userData.userInfo.uid === msgItem.senderId
                  ? msgItem.receiverName
                  : msgItem.senderName
              }`
            );
          })
          .catch((error) => {
            console.log(error.code);
          });
      });
    } else if (data.activeChat.focusedItem.status === "group") {
      let groupTypeId = msgItem.groupId ? msgItem.groupId : msgItem.id;

      set(push(ref(db, "groupMsg/")), {
        whoSendName: data.userData.userInfo.displayName,
        whoSendId: data.userData.userInfo.uid,

        ...(data.userData.userInfo.uid === msgItem.adminId && {
          whoSendPhoto: data.userData.userInfo.photoURL
            ? data.userData.userInfo.photoURL
            : "adminPhoto__missing",
        }),
        ...(data.userData.userInfo.uid === msgItem.memberId && {
          whoSendPhoto: data.userData.userInfo.photoURL
            ? data.userData.userInfo.photoURL
            : "memberPhoto__missing",
        }),

        whoReceiveName: msgItem.groupName,
        whoReceiveId: groupTypeId,

        ...(message.msg && { msg: message.msg }),
        ...(message.img && { img: message.img, imgRef: message.imgRef }),
        ...(message.audio && {
          audio: message.audio,
          audioRef: message.audioRef,
        }),

        ...(data.userData.userInfo.uid === msgItem.adminId && {
          senderAs: "admin",
        }),
        ...(data.userData.userInfo.uid === msgItem.memberId && {
          senderAs: "member",
        }),
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()} `,
      })
        .then(() => {
          setIsSent(data.userData.userInfo.uid + groupTypeId);
          toast(`Forwarded to ${msgItem.groupName}`);
        })
        .catch((error) => {
          console.log(error.code);
        });
    }
  };

  let id =
    data.activeChat.focusedItem.senderId === data.userData.userInfo.uid
      ? data.activeChat.focusedItem.receiverId
      : data.activeChat.focusedItem.senderId;

  let handleSearch = (e) => {
    if (data.activeChat.focusedItem.status === "single") {
      let arr = [];

      friends.filter((item) => {
        if (
          data.userData.userInfo.uid === item.receiverId &&
          item.senderName.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          arr.push(item);
        } else if (
          data.userData.userInfo.uid === item.senderId &&
          item.receiverName.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          arr.push(item);
        }
      });
      setSearchArr(arr);
    } else if (data.activeChat.focusedItem.status === "group") {
      let arr = [];

      attastGroup.filter((item) => {
        if (
          item.groupName.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          arr.push(item);
        }
      });
      setAllMyGroup(arr);
    }
  };

  return (
    <section className="section__main  blend__mood">
      <div className="section__heading">
        <h2 className="section__heading__title"> Forward Message </h2>
        <TextField
          onChange={handleSearch}
          size="small"
          label="Search"
          variant="outlined"
        />
      </div>

      {data.activeChat.focusedItem.status === "single" ? (
        <Lists>
          {searchArr.length > 0 ? (
            searchArr.map((item, index) =>
              data.userData.userInfo.uid === item.receiverId
                ? id !== item.senderId &&
                  (buttonChange.includes(
                    item.senderId + data.userData.userInfo.uid
                  ) ? (
                    <ListItem
                      key={index}
                      imageAs="small"
                      photoURL={item.senderPhoto}
                      userAs="active"
                      heading={item.senderName}
                      textAs={item.lastMsg}
                      button="afterClickButton"
                      buttonText="Sent"
                      loader={loader}
                    />
                  ) : (
                    <ListItem
                      key={index}
                      imageAs="small"
                      photoURL={item.senderPhoto}
                      userAs="active"
                      heading={item.senderName}
                      textAs={item.lastMsg}
                      button="button"
                      buttonText="Send"
                      handleClick={() => handleSendMsg(item)}
                      loader={loader}
                    />
                  ))
                : id !== item.receiverId &&
                  (buttonChange.includes(
                    data.userData.userInfo.uid + item.receiverId
                  ) ? (
                    <ListItem
                      key={index}
                      imageAs="small"
                      photoURL={item.receiverPhoto}
                      userAs="active"
                      heading={item.receiverName}
                      textAs={item.lastMsg}
                      button="afterClickButton"
                      buttonText="Sent"
                      loader={loader}
                    />
                  ) : (
                    <ListItem
                      key={index}
                      imageAs="small"
                      photoURL={item.receiverPhoto}
                      userAs="active"
                      heading={item.receiverName}
                      textAs={item.lastMsg}
                      button="button"
                      buttonText="Send"
                      handleClick={() => handleSendMsg(item)}
                      loader={loader}
                    />
                  ))
            )
          ) : friends.length > 0 ? (
            friends.map((item, index) =>
              data.userData.userInfo.uid === item.receiverId
                ? id !== item.senderId &&
                  (buttonChange.includes(
                    item.senderId + data.userData.userInfo.uid
                  ) ? (
                    <ListItem
                      key={index}
                      imageAs="small"
                      photoURL={item.senderPhoto}
                      userAs="active"
                      heading={item.senderName}
                      textAs={item.lastMsg}
                      button="afterClickButton"
                      buttonText="Sent"
                      loader={loader}
                    />
                  ) : (
                    <ListItem
                      key={index}
                      imageAs="small"
                      photoURL={item.senderPhoto}
                      userAs="active"
                      heading={item.senderName}
                      textAs={item.lastMsg}
                      button="button"
                      buttonText="Send"
                      handleClick={() => handleSendMsg(item)}
                      loader={loader}
                    />
                  ))
                : id !== item.receiverId &&
                  (buttonChange.includes(
                    data.userData.userInfo.uid + item.receiverId
                  ) ? (
                    <ListItem
                      key={index}
                      imageAs="small"
                      photoURL={item.receiverPhoto}
                      userAs="active"
                      heading={item.receiverName}
                      textAs={item.lastMsg}
                      button="afterClickButton"
                      buttonText="Sent"
                      loader={loader}
                    />
                  ) : (
                    <ListItem
                      key={index}
                      imageAs="small"
                      photoURL={item.receiverPhoto}
                      userAs="active"
                      heading={item.receiverName}
                      textAs={item.lastMsg}
                      button="button"
                      buttonText="Send"
                      handleClick={() => handleSendMsg(item)}
                      loader={loader}
                    />
                  ))
            )
          ) : (
            <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
              No Friends..!
            </Alert>
          )}
        </Lists>
      ) : (
        <>
          <Lists>
            {groups.length > 0 || groupM.length > 0 ? (
              <>
                {allMyGroup.length > 0 ? (
                  allMyGroup.map(
                    (item, index) =>
                      data.activeChat.focusedItem.id !== item.id &&
                      (isSent.includes(data.userData.userInfo.uid + item.id) ? (
                        <ListItem
                          key={index}
                          imageAs="small"
                          photoURL={
                            item.groupPhotoURL
                              ? item.groupPhotoURL
                              : item.groupPhoto
                          }
                          userAs="active"
                          heading={item.groupName}
                          textAs={item.adminName}
                          button="afterClickButton"
                          buttonText="Sent"
                          loader={loader}
                        />
                      ) : (
                        <ListItem
                          key={index}
                          imageAs="small"
                          photoURL={
                            item.groupPhotoURL
                              ? item.groupPhotoURL
                              : item.groupPhoto
                          }
                          userAs="active"
                          heading={item.groupName}
                          textAs={item.adminName}
                          button="button"
                          buttonText="Send"
                          handleClick={() => handleSendMsg(item)}
                          loader={loader}
                        />
                      ))
                  )
                ) : (
                  <>
                    {groups.map(
                      (item, index) =>
                        data.activeChat.focusedItem.id !== item.id &&
                        (isSent.includes(
                          data.userData.userInfo.uid + item.id
                        ) ? (
                          <ListItem
                            key={index}
                            imageAs="small"
                            photoURL={item.groupPhotoURL}
                            userAs="active"
                            heading={item.groupName}
                            textAs={item.adminName}
                            button="afterClickButton"
                            buttonText="Sent"
                            loader={loader}
                          />
                        ) : (
                          <ListItem
                            key={index}
                            imageAs="small"
                            photoURL={item.groupPhotoURL}
                            userAs="active"
                            heading={item.groupName}
                            textAs={item.adminName}
                            button="button"
                            buttonText="Send"
                            handleClick={() => handleSendMsg(item)}
                            loader={loader}
                          />
                        ))
                    )}

                    {groupM.map(
                      (item) =>
                        data.activeChat.focusedItem.groupId !== item.groupId &&
                        (isSent.includes(
                          data.userData.userInfo.uid + item.groupId
                        ) ? (
                          <ListItem
                            key={item.groupId}
                            imageAs="small"
                            photoURL={item.groupPhoto}
                            userAs="active"
                            heading={item.groupName}
                            textAs={item.groupAdminName}
                            button="afterClickButton"
                            buttonText="Sent"
                            loader={loader}
                          />
                        ) : (
                          <ListItem
                            key={item.groupId}
                            imageAs="small"
                            photoURL={item.groupPhoto}
                            userAs="active"
                            heading={item.groupName}
                            textAs={item.groupAdminName}
                            button="button"
                            buttonText="Send"
                            handleClick={() => handleSendMsg(item)}
                            loader={loader}
                          />
                        ))
                    )}
                  </>
                )}
              </>
            ) : (
              <Alert
                sx={{ marginTop: "20px" }}
                variant="filled"
                severity="info"
              >
                Empty Group List..!
              </Alert>
            )}
          </Lists>
        </>
      )}
    </section>
  );
};

export default ForwardMessage;
