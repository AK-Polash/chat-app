import React from "react";

const Image = ({ className, imageSource, alt }) => {
  return (
    <>
      <img className={className} src={imageSource} alt={alt} />
    </>
  );
};

export default Image;
