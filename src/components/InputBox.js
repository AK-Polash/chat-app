import React from "react";

const InputBox = (props) => {
  return (
    <>
      {/* <TextField className={className} label={label} variant={variant} /> */}

      <props.fieldName
        className={props.className}
        label={props.label}
        variant={props.variant}
        size={props.size}
        type={props.type}
      />
    </>
  );
};

export default InputBox;
