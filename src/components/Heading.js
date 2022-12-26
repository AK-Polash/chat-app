import React from "react";

const Heading = (props) => {
  return (
    <>
      {props.as === undefined ? (
        <h2 className={props.className}>
          {props.title === undefined ? "'as' Nai 'title' Nai" : props.title}
        </h2>
      ) : (
        <props.as className={props.className}>
          {props.title === undefined ? "'as' Ase 'title' Nai" : props.title}
        </props.as>
      )}
    </>
  );
};

export default Heading;
