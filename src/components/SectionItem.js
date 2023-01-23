import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Image from "./Image";

const SectionItem = ({ data, button, sectionHeadingTitle }) => {
  return (
    <section className="section__main">
      <div className="section__heading">
        <h2 className="section__heading__title"> {sectionHeadingTitle} </h2>
        <HiOutlineDotsVertical className="section__heading__icon" />
      </div>

      <div className="section__inner">
        {button ? (
          <>
            {data.map((item, index) => (
              <div className="section__users" key={index}>
                <div className="user__content">
                  <div className="user__image__holder">
                    <Image
                      imageSource="assets/user_1.png"
                      className="user__image"
                      alt="user"
                    />
                  </div>
                  <div className="user__text__holder">
                    <h3 className="user__heading"> {item.name} </h3>
                    {item.lastMsg && (
                      <div className="user__sub__heading"> {item.lastMsg} </div>
                    )}

                    {item.lastSeen && (
                      <div className="user__sub__heading  last__seen">
                        {item.lastSeen}
                      </div>
                    )}
                  </div>
                </div>

                <button className="user__btn"> {item.buttonText} </button>
              </div>
            ))}
          </>
        ) : (
          <>
            {data.map((item, index) => (
              <div className="section__users" key={index}>
                <div className="user__content">
                  <div className="user__image__holder">
                    <Image
                      imageSource="assets/user_1.png"
                      className="user__image"
                      alt="user"
                    />
                  </div>
                  <div className="user__text__holder">
                    <h3 className="user__heading"> {item.name} </h3>
                    {item.lastMsg && (
                      <div className="user__sub__heading">{item.lastMsg}</div>
                    )}
                  </div>
                </div>

                {item.lastSeen && (
                  <div className="user__sub__heading  last__seen">
                    {item.lastSeen}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default SectionItem;
