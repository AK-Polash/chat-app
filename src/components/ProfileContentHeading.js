import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Image from "./Image";
import { Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ProfileContentHeading = ({ userAs, title, status, photoURL }) => {
  return (
    <div className="section__heading  extra__padding">
      <div className="profile__heading__chat">
        {userAs === "active" ? (
          <div className="user__large__image__holder">
            <StyledBadge
              sx={{ width: "100%", height: "100%" }}
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              {photoURL ? (
                <Image
                  imageSource={photoURL}
                  className="user__image"
                  alt="user"
                />
              ) : (
                <Avatar
                  sx={{ width: "100%", height: "100%" }}
                  className="profile__img"
                />
              )}
            </StyledBadge>
          </div>
        ) : (
          <>
            <div className="user__large__image__holder">
              {photoURL ? (
                <Image
                  imageSource={photoURL}
                  className="user__image"
                  alt="user"
                />
              ) : (
                <Avatar
                  sx={{ width: "100%", height: "100%" }}
                  className="profile__img"
                />
              )}
            </div>
          </>
        )}

        <div>
          <h2> {title} </h2>
          <span> {status} </span>
        </div>
      </div>

      <HiOutlineDotsVertical className="section__heading__icon" />
    </div>
  );
};

export default ProfileContentHeading;
