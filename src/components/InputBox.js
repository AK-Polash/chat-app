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
        name={props.name}
        onChange={props.onChange}
      />
    </>
  );
};

export default InputBox;
