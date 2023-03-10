import React, { useState, useEffect } from "react";
import ContentHeading from "./ContentHeading";
import Lists from "./Lists";
import ListItem from "./ListItem";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
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
import { ColorRing } from "react-loader-spinner";

const FriendRequest = () => {
  const db = getDatabase();
  let data = useSelector((state) => state);
  let [friendRequests, setFriendRequests] = useState([]);
  let [loader, setLoader] = useState(false);

  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest/");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        // Note: amr(Current Logged in user) id er sathe jodi kuno receiver er id er mil pawa jay taholei amake kew request pathaise..
        if (item.val().receiverId === data.userData.userInfo.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });

      setFriendRequests(arr);
    });
  }, []);

  let handleAcceptFriendRequest = (friendReq) => {
    setLoader(true);

    set(push(ref(db, "friends")), {
      ...friendReq,
      date: `${new Date().getDate()} - ${
        new Date().getMonth() + 1
      } - ${new Date().getFullYear()} `,
    }).then(() => {
      remove(ref(db, "friendRequest/" + friendReq.id)).then(() => {
        toast("New Friend Added!");
        setLoader(false);
      });
    });
  };

  let handleRejectFriendRequest = (friendReq) => {
    setLoader(true);

    remove(ref(db, "friendRequest/" + friendReq.id)).then(() => {
      toast("Rejected Friend Request..!");
      setLoader(false);
    });
  };

  return (
    <section className="section__main">
      <ContentHeading heading="Friend Request" />

      <Lists>
        {friendRequests.length > 0 ? (
          friendRequests.map((item, index) => (
            <ListItem
              key={index}
              imageAs="large"
              photoURL={item.senderPhoto}
              heading={item.senderName}
              headingAs="h4"
              textAs="Hi buddy.."
              button="dualButton"
              buttonOneText="Accept"
              buttonOneOnclick={() => handleAcceptFriendRequest(item)}
              buttonTwoText="Reject"
              buttonTwoOnclick={() => handleRejectFriendRequest(item)}
              loader={loader}
            />
          ))
        ) : (
          <Alert sx={{ marginTop: "20px" }} variant="filled" severity="info">
            No Friend Request!
          </Alert>
        )}
      </Lists>
    </section>
  );
};

export default FriendRequest;
