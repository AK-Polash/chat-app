import React from "react";

const CustomButton = (props) => {
  return (
    <props.buttonName variant="contained" disableRipple>
      {props.title}
    </props.buttonName>
  );
};

export default CustomButton;
