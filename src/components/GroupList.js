import React from "react";
import ContentHeading from "./ContentHeading";
import Image from "./Image";

const GroupList = () => {
  return (
    <section className="section__main">
      <ContentHeading heading="Group List" />

      <div className="section__users">
        <div className="user__content">
          <div className="user__image__holder">
            <Image
              imageSource="assets/group_2.png"
              className="user__image"
              alt="user"
            />
          </div>
          <div className="user__text__holder">
            <h3 className="user__heading"> Crazy Coders </h3>
            <div className="user__sub__heading"> Hi there..! </div>
          </div>
        </div>

        <button className="user__btn"> Join </button>
      </div>
    </section>
  );
};

export default GroupList;
