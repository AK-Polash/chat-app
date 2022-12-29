import React from "react";

const InputBox = (props) => {
  return (
    <>
      <props.fieldName
        className={props.className}
        label={props.label}
        variant={props.variant}
        size={props.size}
        type={props.type}
        name={props.name}
        onChange={props.onChange}
        value={props.value}
      />
    </>
  );
};

export default InputBox;
