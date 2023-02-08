import React from "react";
import Image from "./Image";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { HiPlus } from "react-icons/hi";
import Avatar from "@mui/material/Avatar";
import { ColorRing } from "react-loader-spinner";

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

const ListItem = (props) => {
  return (
    <div className="section__users">
      <div className="user__left__side">
        {/* for Large Image start */}
        {props.imageAs === "large" && props.userAs === "active" ? (
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
              {props.photoURL ? (
                <Image
                  imageSource={props.photoURL}
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
            {props.imageAs === "large" && (
              <div className="user__large__image__holder">
                {props.photoURL ? (
                  <Image
                    imageSource={props.photoURL}
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
            )}
          </>
        )}
        {/* for Large Image end */}

        {/* for Small Image start */}
        {props.imageAs === "small" && props.userAs === "active" ? (
          <div className="user__small__image__holder">
            <StyledBadge
              sx={{ width: "100%", height: "100%" }}
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              {props.photoURL ? (
                <Image
                  imageSource={props.photoURL}
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
            {props.imageAs === "small" && (
              <div className="user__small__image__holder">
                {props.photoURL ? (
                  <Image
                    imageSource={props.photoURL}
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
            )}
          </>
        )}
        {/* for Small Image end */}

        <div className="user__text__holder">
          <>
            {props.headingAs === "h4" ? (
              <props.headingAs className="user__heading__large">
                {props.heading}
              </props.headingAs>
            ) : (
              <h5 className="user__heading__small"> {props.heading} </h5>
            )}

            {props.headingAs === "h4" && props.textAs !== undefined ? (
              <p className="sub__heading__large"> {props.textAs} </p>
            ) : (
              <p className="sub__heading__small"> {props.textAs} </p>
            )}
          </>
        </div>
      </div>

      <div className="user__right__side">
        {props.button === "button" ? (
          props.loader ? (
            <ColorRing
              visible={true}
              height="42"
              width="42"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : (
            <button onClick={props.handleClick} className="user__btn">
              {props.buttonText}
            </button>
          )
        ) : props.button === "icon" ? (
          props.loader ? (
            <ColorRing
              visible={true}
              height="42"
              width="42"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : (
            <button
              onClick={props.handleAddFriendRequest}
              className="user__icon__btn"
            >
              <HiPlus />
            </button>
          )
        ) : props.button === "dualButton" ? (
          <>
            {props.loader ? (
              <ColorRing
                visible={true}
                height="42"
                width="42"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            ) : (
              <>
                <button
                  onClick={props.buttonOneOnclick}
                  className="user__btn"
                >
                  {props.buttonOneText}
                </button>
                <button
                  onClick={props.buttonTwoOnclick}
                  className="user__btn"
                >
                  {props.buttonTwoText}
                </button>
              </>
            )}
          </>
        ) : props.button === "buttonAndText" ? (
          <>
            <div className="sub__heading__small">{props.contentText}</div>

            {props.loader ? (
              <ColorRing
                visible={true}
                height="42"
                width="42"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            ) : (
              <>
                <button onClick={props.buttonOneOnClick} className="user__btn">
                  {props.buttonOneText}
                </button>

                <button onClick={props.buttonTwoOnClick} className="user__btn">
                  {props.buttonTwoText}
                </button>
              </>
            )}
          </>
        ) : (
          <p className="sub__heading__small"> {props.buttonText} </p>
        )}
      </div>
    </div>
  );
};

export default ListItem;
