import React from "react";
import ContentHeading from "./ContentHeading";
import Image from "./Image";

const FriendRequest = () => {
  return (
    <section className="section__main">
      <ContentHeading heading="Friend List" />

      <div className="section__users">
        <div className="user__content">
          <div className="user__image__holder">
            <Image
              imageSource="assets/user_3.png"
              className="user__image"
              alt="user"
            />
          </div>
          <div className="user__text__holder">
            <h3 className="user__heading"> Rakib Khan </h3>
            <div className="user__sub__heading"> Hey budy..!</div>
          </div>
        </div>

        <button className="user__btn"> Accept </button>
      </div>
    </section>
  );
};

export default FriendRequest;
