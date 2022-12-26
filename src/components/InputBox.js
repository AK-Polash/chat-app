import React from "react";
import TextField from "@mui/material/TextField";

const InputBox = ({ className, label, variant }) => {
  return (
    <>
      <TextField className={className} label={label} variant={variant} />
    </>
  );
};

export default InputBox;
