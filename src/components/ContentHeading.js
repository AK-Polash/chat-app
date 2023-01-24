import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

const ContentHeading = ({ heading }) => {
  return (
    <div className="section__heading">
      <h2 className="section__heading__title"> {heading} </h2>
      <HiOutlineDotsVertical className="section__heading__icon" />
    </div>
  );
};

export default ContentHeading;
