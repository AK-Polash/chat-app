import React from "react";
import { Link } from "react-router-dom";

const AuthenticationLink = ({
  className,
  textTitle,
  linkTitle,
  href,
  textClassName,
  linkClassName,
}) => {
  return (
    <p className={className}>
      <span className={textClassName}> {textTitle} </span>
      <Link className={linkClassName} to={href}>
        {linkTitle}
      </Link>
    </p>
  );
};

export default AuthenticationLink;
