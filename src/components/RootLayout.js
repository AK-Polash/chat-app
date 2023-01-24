import React, { useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../slices/userSlice";
import { getAuth, signOut } from "firebase/auth";
import Grid from "@mui/material/Grid";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Image from "./Image";

const RootLayout = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let data = useSelector((state) => state);

  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);

  let handleLogOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(activeUser(null));
        localStorage.removeItem("userInfo");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Grid container columnSpacing={2} sx={{ padding: "0 16px" }}>
        <Grid
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          item
          xs={1}
        >
          <div className="menu__main">
            <div className="user__holder">
              <div className="image__holder">
                <Image
                  className="profile__img"
                  imageSource="assets/profile__img.png"
                  alt="Profile Img"
                />
              </div>
              <h4 className="user__name">
                {data.userData.userInfo.displayName}
              </h4>
            </div>
            <div className="menu__holder">
              <div className="menu">
                <div className="icon__holder">
                  <NavLink to="/">
                    <IoHomeOutline className="icon" title="Home" />
                  </NavLink>
                </div>
                <div className="icon__holder">
                  <NavLink to="message">
                    <AiOutlineMessage className="icon" title="Chat" />
                  </NavLink>
                </div>
                <div className="icon__holder">
                  <NavLink to="notification">
                    <IoMdNotificationsOutline
                      className="icon"
                      title="Notification"
                    />
                  </NavLink>
                </div>
                <div className="icon__holder">
                  <NavLink to="settings">
                    <IoSettingsOutline className="icon" title="Settings" />
                  </NavLink>
                </div>
              </div>
              <div className="logout__holder">
                <RiLogoutBoxRLine
                  onClick={handleLogOut}
                  className="icon"
                  title="Log Out"
                />
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          item
          xs={11}
        >
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};

export default RootLayout;
