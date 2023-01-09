import React from "react";

const Image = ({ className, onClick, imageSource, alt }) => {
  return (
    <>
      <img
        onClick={onClick}
        className={className}
        src={imageSource}
        alt={alt}
      />
    </>
  );
};

export default Image;
