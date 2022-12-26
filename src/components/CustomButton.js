import React from "react";

const CustomButton = (props) => {
  return (
    <props.buttonName
      className={props.className}
      variant="contained"
      disableRipple
    >
      {props.title}
    </props.buttonName>
  );
};

export default CustomButton;
