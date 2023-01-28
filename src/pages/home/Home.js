import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
} from "firebase/database";
import ContentHeading from "../../components/ContentHeading";
import UserLists from "../../components/UserLists";
import UserListItem from "../../components/UserListItem";
import Alert from "@mui/material/Alert";
import "./home.css";

const Home = () => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [users, setUsers] = useState([]);
  let [friendRequests, setFriendRequests] = useState([]);
  let [friendConnection, setFriendConnection] = useState([]);

  useEffect(() => {
    // Reading Realtime User List (persons who has already completed Registration):
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

    // Reading Realtime Friend Request:
    const friendRequestRef = ref(db, "friendRequest/");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];
      let arrTwo = [];

      snapshot.forEach((item) => {
        // Note: amr(Current Logged in user) id er sathe jodi kuno receiver er id er mil pawa jay taholei amake kew request pathaise..
        if (item.val().receiverId === data.userData.userInfo.uid) {
          arr.push(item.val());
        }
        arrTwo.push(item.val().senderId + item.val().receiverId);
      });

      setFriendRequests(arr);
      setFriendConnection(arrTwo);
    });
  }, []);

  // let [buttonType, setButtonType] = useState(false);
  let handleAddFriend = (clickedUser) => {
    // setButtonType(true);

    set(push(ref(db, "friendRequest/")), {
      senderName: data.userData.userInfo.displayName,
      senderId: data.userData.userInfo.uid,
      receiverName: clickedUser.username,
      receiverId: clickedUser.id,
    });

    console.log("Friend Request sent..!");
  };

  let handleCancel = (cancelItem) => {
    const friendRequestRef = ref(db, "friendRequest/");
    onValue(friendRequestRef, (snapshot) => {
      snapshot.forEach((item) => {
        if (cancelItem.id === item.val().receiverId) {
          remove(ref(db, "friendRequest/" + item.key)).then(() => {
            console.log("cancel hoise");
          });
        }
      });
    });
  };

  return (
    <div className="main__home">
      <Grid container spacing={3} sx={{ height: "100%" }}>
        {/* ================================== Group List START ==================================== */}
        <Grid item xs={4}>
          <section className="section__main">
            <ContentHeading heading="Group List" />

            <UserLists>
              <UserListItem
                imageAs="large"
                heading="Friends Forever"
                headingAs="h4"
                textAs="Hi all..!"
                button="button"
                buttonText="Add"
              />
              <UserListItem
                imageAs="large"
                heading="Guitar BD"
                headingAs="h4"
                textAs="Hi all..!"
                button="button"
                buttonText="Add"
              />
              <UserListItem
                imageAs="large"
                heading="Web Coders"
                headingAs="h4"
                textAs="Hi all..!"
                button="button"
                buttonText="Add"
              />
              <UserListItem
                imageAs="large"
                heading="Photography"
                headingAs="h4"
                textAs="Hi all..!"
                button="button"
                buttonText="Add"
              />
            </UserLists>
          </section>
        </Grid>
        {/* ================================== Group List END ==================================== */}

        {/* ================================== Friends START ==================================== */}
        <Grid item xs={4}>
          <section className="section__main">
            <ContentHeading heading="Friends" />

            <UserLists>
              <UserListItem
                imageAs="small"
                // userAs="active"
                heading="Asif Khan"
                textAs="hi..!"
                buttonText="Today, 8pm"
              />
              <UserListItem
                imageAs="small"
                userAs="active"
                heading="Asif Khan"
                textAs="hello..!"
                buttonText="Today, 8pm"
              />
              <UserListItem
                imageAs="small"
                // userAs="active"
                heading="Asif Khan"
                textAs="hey..!"
                buttonText="Today, 8pm"
              />
              <UserListItem
                imageAs="small"
                userAs="active"
                heading="Asif Khan"
                textAs="hello..!"
                buttonText="Today, 8pm"
              />
            </UserLists>
          </section>
        </Grid>
        {/* ================================== Friends END ==================================== */}

        {/* ================================== User List START ==================================== */}
        <Grid item xs={4}>
          <section className="section__main">
            <ContentHeading heading="User List" />

            <UserLists>
              {users.map((item) =>
                friendConnection.includes(
                  data.userData.userInfo.uid + item.id
                ) ||
                friendConnection.includes(
                  item.id + data.userData.userInfo.uid
                ) ? (
                  <UserListItem
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
                  <UserListItem
                    key={item.id}
                    imageAs="small"
                    heading={item.username}
                    textAs="Yestarday, 5am"
                    button="icon"
                    handleAddFriendRequest={() => handleAddFriend(item)}
                  />
                )
              )}
            </UserLists>
          </section>
        </Grid>
        {/* ================================== User List END ==================================== */}

        {/* ================================== Friend Request START ==================================== */}
        <Grid item xs={4}>
          <section className="section__main">
            <ContentHeading heading="Friend Request" />

            <UserLists>
              {friendRequests.length > 0 ? (
                friendRequests.map((item, index) => (
                  <UserListItem
                    key={index}
                    imageAs="large"
                    heading={item.senderName}
                    headingAs="h4"
                    textAs="Hi buddy.."
                    button="dualButton"
                    buttonOneText="Accept"
                    buttonTwoText="Reject"
                  />
                ))
              ) : (
                <Alert
                  sx={{ marginTop: "20px" }}
                  variant="filled"
                  severity="info"
                >
                  No Friend Request!
                </Alert>
              )}
            </UserLists>
          </section>
        </Grid>
        {/* ================================== Friend Request END ==================================== */}

        {/* ================================== My Group START ==================================== */}
        <Grid item xs={4}>
          <section className="section__main">
            <ContentHeading heading="My Group" />

            <UserLists>
              <UserListItem
                imageAs="small"
                heading="Asif Khan"
                textAs="hi..!"
                buttonText="Today, 8pm"
              />
              <UserListItem
                imageAs="small"
                heading="Asif Khan"
                textAs="hello..!"
                buttonText="Today, 8pm"
              />
              <UserListItem
                imageAs="small"
                heading="Asif Khan"
                textAs="hey..!"
                buttonText="Today, 8pm"
              />
              <UserListItem
                imageAs="small"
                heading="Asif Khan"
                textAs="hello..!"
                buttonText="Today, 8pm"
              />
            </UserLists>
          </section>
        </Grid>
        {/* ================================== My Group END ==================================== */}

        {/* ================================== Block List START ==================================== */}
        <Grid item xs={4}>
          <section className="section__main">
            <ContentHeading heading="Block List" />

            <UserLists>
              <UserListItem
                imageAs="small"
                heading="Emon Islam"
                textAs="Yestarday, 5am"
                button="button"
                buttonText="Unblock"
              />
              <UserListItem
                imageAs="small"
                heading="Sajid Islam"
                textAs="Yestarday, 5am"
                button="button"
                buttonText="Unblock"
              />
              <UserListItem
                imageAs="small"
                heading="Afjal Hasan"
                textAs="Yestarday, 5am"
                button="button"
                buttonText="Unblock"
              />
              <UserListItem
                imageAs="small"
                heading="Humayun Khan"
                textAs="Yestarday, 5am"
                button="button"
                buttonText="Unblock"
              />
            </UserLists>
          </section>
        </Grid>
        {/* ================================== Block List END ==================================== */}
      </Grid>
    </div>
  );
};

export default Home;
