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
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

const UserList = () => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [users, setUsers] = useState([]);
  let [friendConnection, setFriendConnection] = useState([]);
  let [friendConnectionKey, setFriendConnectionKey] = useState([]);
  let [friends, setFriends] = useState([]);

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
  }, []);

  // Send Friend Request Functionality:
  let handleAddFriend = (clickedUser) => {
    set(push(ref(db, "friendRequest/")), {
      senderName: data.userData.userInfo.displayName,
      senderId: data.userData.userInfo.uid,
      receiverName: clickedUser.username,
      receiverId: clickedUser.id,
    });

    toast("Friend Request sent..!");
  };

  // Cancel Send Friend Request Functionality:
  let handleCancel = (cancelItem) => {
    friendConnectionKey.map((item) => {
      if (cancelItem.id === item.receiverId) {
        remove(ref(db, "friendRequest/" + item.id)).then(() => {
          toast("Canceled Friend Request..!");
        });
      }
    });
  };

  return (
    <Grid item xs={4}>
      <section className="section__main">
        <ContentHeading heading="User List" />

        <Lists>
          {users.length > 0 ? (
            users.map((item) =>
              friends.includes(data.userData.userInfo.uid + item.id) ||
              friends.includes(item.id + data.userData.userInfo.uid) ? (
                <ListItem
                  key={item.id}
                  imageAs="small"
                  heading={item.username}
                  textAs="Today, 3pm"
                  button="button"
                  buttonText="Friend"
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
                    heading={item.username}
                    textAs="Yestarday, 5am"
                    button="dualButton"
                    buttonOneText="Pending"
                    buttonTwoText="Cancel"
                    buttonTwoOnclick={() => handleCancel(item)}
                  />
                ) : (
                  <ListItem
                    key={item.id}
                    imageAs="small"
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
                  heading={item.username}
                  textAs="Yestarday, 5am"
                  button="icon"
                  handleAddFriendRequest={() => handleAddFriend(item)}
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
    </Grid>
  );
};

export default UserList;