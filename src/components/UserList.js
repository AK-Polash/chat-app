import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
} from "firebase/database";
import { toast } from "react-toastify";
import { Grid, Alert, TextField } from "@mui/material/";

const UserList = () => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [users, setUsers] = useState([]);
  let [searchArr, setSearchArr] = useState([]);
  let [friendConnection, setFriendConnection] = useState([]);
  let [friendConnectionKey, setFriendConnectionKey] = useState([]);
  let [friends, setFriends] = useState([]);
  let [blockList, setBlockList] = useState([]);
  let [loader, setLoader] = useState(false);

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid !== item.key) {
          arr.push({ ...item.val(), id: item.key });
        }
      });

      setUsers(arr);
    });

    const friendRequestRef = ref(db, "friendRequest/");
    onValue(friendRequestRef, (snapshot) => {
      let arrTwo = [];
      let arrThree = [];
      snapshot.forEach((item) => {
        arrTwo.push(item.val().senderId + item.val().receiverId);
        arrThree.push({ ...item.val(), id: item.key });
      });

      setFriendConnection(arrTwo);
      setFriendConnectionKey(arrThree);
    });

    const friendsRef = ref(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let friendsArr = [];
      snapshot.forEach((item) => {
        friendsArr.push(item.val().senderId + item.val().receiverId);
      });

      setFriends(friendsArr);
    });

    const blockListRef = ref(db, "blockList/");
    onValue(blockListRef, (snapshot) => {
      let blockListArr = [];
      snapshot.forEach((item) => {
        blockListArr.push(item.val().blockById + item.val().blockId);
      });

      setBlockList(blockListArr);
    });
  }, []);

  // Send Friend Request Functionality:
  let handleAddFriend = (clickedUser) => {
    setLoader(true);

    // eikhane sender + receiver er photoURL null thakle Friend Request Send hoy na...!!
    set(push(ref(db, "friendRequest/")), {
      senderName: data.userData.userInfo.displayName,
      senderId: data.userData.userInfo.uid,
      senderPhoto: data.userData.userInfo.photoURL
        ? data.userData.userInfo.photoURL
        : "",
      receiverName: clickedUser.username,
      receiverId: clickedUser.id,
      receiverPhoto: clickedUser.photoURL ? clickedUser.photoURL : "",
    }).then(() => {
      toast("Friend Request sent..!");
      setLoader(false);
    });
  };

  // Cancel Send Friend Request Functionality:
  let handleCancel = (cancelItem) => {
    setLoader(true);

    friendConnectionKey.map((item) => {
      if (cancelItem.id === item.receiverId) {
        remove(ref(db, "friendRequest/" + item.id)).then(() => {
          toast("Canceled Friend Request..!");
          setLoader(false);
        });
      }
    });
  };

  let handleSearch = (e) => {
    let arr = [];

    users.filter((item) => {
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        arr.push(item);
      }
    });
    setSearchArr(arr);
  };

  return (
    <section className="section__main">
      {/* <ContentHeading heading="User List" /> */}
      <div className="section__heading">
        <h2 className="section__heading__title"> User List </h2>
        <TextField
          onChange={handleSearch}
          size="small"
          label="Search"
          variant="outlined"
        />
      </div>

      <Lists>
        {searchArr.length > 0 ? (
          searchArr.map((item) =>
            friends.includes(data.userData.userInfo.uid + item.id) ||
            friends.includes(item.id + data.userData.userInfo.uid) ? (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.photoURL}
                heading={item.username}
                textAs="Today, 3pm"
                button="button"
                buttonText="Friend"
              />
            ) : blockList.includes(data.userData.userInfo.uid + item.id) ? (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.photoURL}
                heading={item.username}
                textAs="Today, 3pm"
                button="button"
                buttonText="Blocked"
              />
            ) : blockList.includes(item.id + data.userData.userInfo.uid) ? (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.photoURL}
                heading={item.username}
                textAs="Today, 3pm"
                buttonText="You Blocked By"
              />
            ) : friendConnection.includes(
                data.userData.userInfo.uid + item.id
              ) ||
              friendConnection.includes(
                item.id + data.userData.userInfo.uid
              ) ? (
              friendConnection.includes(
                data.userData.userInfo.uid + item.id
              ) ? (
                <ListItem
                  key={item.id}
                  imageAs="small"
                  photoURL={item.photoURL}
                  heading={item.username}
                  textAs="Yestarday, 5am"
                  button="dualButton"
                  buttonOneText="Pending"
                  buttonTwoText="Cancel"
                  buttonTwoOnclick={() => handleCancel(item)}
                  loader={loader}
                />
              ) : (
                <ListItem
                  key={item.id}
                  imageAs="small"
                  photoURL={item.photoURL}
                  heading={item.username}
                  textAs="Yestarday, 5am"
                  button="button"
                  buttonText="Pending"
                />
              )
            ) : (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.photoURL}
                heading={item.username}
                textAs="Yestarday, 5am"
                button="icon"
                handleAddFriendRequest={() => handleAddFriend(item)}
                loader={loader}
              />
            )
          )
        ) : users.length > 0 ? (
          users.map((item) =>
            friends.includes(data.userData.userInfo.uid + item.id) ||
            friends.includes(item.id + data.userData.userInfo.uid) ? (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.photoURL}
                heading={item.username}
                textAs="Today, 3pm"
                button="button"
                buttonText="Friend"
              />
            ) : blockList.includes(data.userData.userInfo.uid + item.id) ? (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.photoURL}
                heading={item.username}
                textAs="Today, 3pm"
                button="button"
                buttonText="Blocked"
              />
            ) : blockList.includes(item.id + data.userData.userInfo.uid) ? (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.photoURL}
                heading={item.username}
                textAs="Today, 3pm"
                buttonText="You Blocked By"
              />
            ) : friendConnection.includes(
                data.userData.userInfo.uid + item.id
              ) ||
              friendConnection.includes(
                item.id + data.userData.userInfo.uid
              ) ? (
              friendConnection.includes(
                data.userData.userInfo.uid + item.id
              ) ? (
                <ListItem
                  key={item.id}
                  imageAs="small"
                  photoURL={item.photoURL}
                  heading={item.username}
                  textAs="Yestarday, 5am"
                  button="dualButton"
                  buttonOneText="Pending"
                  buttonTwoText="Cancel"
                  buttonTwoOnclick={() => handleCancel(item)}
                  loader={loader}
                />
              ) : (
                <ListItem
                  key={item.id}
                  imageAs="small"
                  photoURL={item.photoURL}
                  heading={item.username}
                  textAs="Yestarday, 5am"
                  button="button"
                  buttonText="Pending"
                />
              )
            ) : (
              <ListItem
                key={item.id}
                imageAs="small"
                photoURL={item.photoURL}
                heading={item.username}
                textAs="Yestarday, 5am"
                button="icon"
                handleAddFriendRequest={() => handleAddFriend(item)}
                loader={loader}
              />
            )
          )
        ) : (
          <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
            No User..!
          </Alert>
        )}
      </Lists>
    </section>
  );
};

export default UserList;
