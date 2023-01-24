import React from "react";
import ContentHeading from "./ContentHeading";
import Image from "./Image";

const MyGroups = () => {
  return (
    <section className="section__main">
      <ContentHeading heading="My Groups" />

      <div className="section__users">
        <div className="user__content">
          <div className="user__image__holder">
            <Image
              imageSource="assets/group_1.png"
              className="user__image"
              alt="Group Img"
            />
          </div>
          <div className="user__text__holder">
            <h3 className="user__heading"> School Friends </h3>
            <div className="user__sub__heading"> Hello everyone..!! </div>
          </div>
        </div>
        <div className="user__sub__heading  last__seen"> Today, 9pm</div>
      </div>
    </section>
  );
};

export default MyGroups;
