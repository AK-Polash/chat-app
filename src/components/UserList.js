import React, { useEffect, useState } from "react";
import ContentHeading from "./ContentHeading";
import Image from "./Image";
import { GoPlus } from "react-icons/go";
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";

const UserList = () => {
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
    <section className="section__main">
      <ContentHeading heading="User List" />
      
      {users.map((item, index) => (
        <div className="section__users" key={index}>
          <div className="user__content">
            <div className="user__image__holder">
              <Image
                imageSource="assets/user_3.png"
                className="user__image"
                alt="user"
              />
            </div>
            <div className="user__text__holder">
              <h3 className="user__heading"> {item.username} </h3>
              <div className="user__sub__heading  last__seen"> Today, 9pm</div>
            </div>
          </div>

          <button className="user__btn square__btn">
            <GoPlus />
          </button>
        </div>
      ))}
    </section>
  );
};

export default UserList;
