import React from "react";
import ContentHeading from "./ContentHeading";
import Image from "./Image";

const BlockList = () => {
  return (
    <section className="section__main">
      <ContentHeading heading="Block List" />

      <div className="section__users">
        <div className="user__content">
          <div className="user__image__holder">
            <Image
              imageSource="assets/user_4.png"
              className="user__image"
              alt="user"
            />
          </div>
          <div className="user__text__holder">
            <h3 className="user__heading"> Sadman Khan </h3>
            <div className="user__sub__heading  last__seen"> Today, 9pm</div>
          </div>
        </div>

        <button className="user__btn"> Unblock </button>
      </div>
    </section>
  );
};

export default BlockList;
