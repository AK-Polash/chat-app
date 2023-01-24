import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue } from "firebase/database";
import ContentHeading from "../../components/ContentHeading";
import UserLists from "../../components/UserLists";
import UserListItem from "../../components/UserListItem";
import "./home.css";

const Home = () => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid !== item.key) {
          arr.push(item.val());
        }
      });
      setUsers(arr);
    });
  }, []);

  return (
    <div className="main__home">
      <Grid container spacing={3} sx={{ height: "100%" }}>
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
        <Grid item xs={4}>
          <section className="section__main">
            <ContentHeading heading="User List" />

            <UserLists>
              {users.map((item, index) => (
                <UserListItem
                  key={index}
                  imageAs="small"
                  heading={item.username}
                  textAs="Yestarday, 5am"
                  button="icon"
                />
              ))}
            </UserLists>
          </section>
        </Grid>
        <Grid item xs={4}>
          <section className="section__main">
            <ContentHeading heading="Friend Request" />

            <UserLists>
              <UserListItem
                imageAs="large"
                heading="Akash Mahmud"
                headingAs="h4"
                textAs="Hi buddy.."
                button="dualButton"
                buttonOneText="Accept"
                buttonTwoText="Reject"
              />
              <UserListItem
                imageAs="large"
                heading="Sumon Hasan"
                headingAs="h4"
                textAs="Hi buddy.."
                button="dualButton"
                buttonOneText="Accept"
                buttonTwoText="Reject"
              />
              <UserListItem
                imageAs="large"
                heading="Emon Islam"
                headingAs="h4"
                textAs="Hi.."
                button="dualButton"
                buttonOneText="Accept"
                buttonTwoText="Reject"
              />
              <UserListItem
                imageAs="large"
                heading="Rimon Khan"
                headingAs="h4"
                textAs="Hi buddy.."
                button="dualButton"
                buttonOneText="Accept"
                buttonTwoText="Reject"
              />
            </UserLists>
          </section>
        </Grid>
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

        {/* <Grid item xs={4}>
          <Friends />
        </Grid>
        <Grid item xs={4}>
          <UserList />
        </Grid>
        <Grid item xs={4}>
          <FriendRequest />
        </Grid>
        <Grid item xs={4}>
          <MyGroups />
        </Grid>
        <Grid item xs={4}>
          <BlockList />
        </Grid> */}
      </Grid>
    </div>
  );
};

export default Home;
