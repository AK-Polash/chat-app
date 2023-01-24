import React from "react";
import ContentHeading from "./ContentHeading";
import Image from "./Image";

const Friends = () => {
  return (
    <section className="section__main">
      <ContentHeading heading="Friends" />

      <div className="section__users">
        <div className="user__content">
          <div className="user__image__holder">
            <Image
              imageSource="assets/user_1.png"
              className="user__image"
              alt="user"
            />
          </div>
          <div className="user__text__holder">
            <h3 className="user__heading"> Akash Mahmud </h3>
            <div className="user__sub__heading"> What's up..? </div>
          </div>
        </div>
        <div className="user__sub__heading  last__seen"> Today, 9pm</div>
      </div>
    </section>
  );
};

export default Friends;
