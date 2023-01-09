import React from "react";

const CustomButton = (props) => {
  return (
    <props.buttonName
      className={props.className}
      variant="contained"
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.title}
    </props.buttonName>
  );
};

export default CustomButton;
