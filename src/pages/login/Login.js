import React from "react";
import Header from "../../components/Header";
import Heading from "../../components/Heading";
import InputBox from "../../components/InputBox";
import Grid from "@mui/material/Grid";
import Image from "../../components/Image";
import CustomButton from "../../components/CustomButton";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AuthenticationLink from "../../components/AuthenticationLink";
import { Link } from "react-router-dom";
import "./login.css";

const CommonButton = styled(Button)({
  color: "#fff",
  borderRadius: "8.71px",
  textTransform: "none",
  lineHeight: "24px",
  padding: "20px 0px",
  border: "2px solid",
  backgroundColor: "#5F35F5",
  borderColor: "transparent",
  fontFamily: ["'Nunito', sans-serif"].join(","),
  fontWeight: "600",
  fontSize: 20,
  "&:hover": {
    backgroundColor: "transparent",
    borderColor: "#5F35F5",
    boxShadow: "none",
    color: "#5F35F5",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "transparent",
    color: "#fff",
  },
  "&:focus": {
    // boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
});

const Login = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className="registration__left__wrapper">
            <div className="registration__left">
              <div>
                <Header>
                  <Heading
                    className="heading"
                    as="h2"
                    title="Login to your account!"
                  />
                  <div className="sub__heading__google">
                    <Link to="#">
                      <Image
                        className="google__img"
                        imageSource="assets/google__img.png"
                        alt="google image"
                      />
                    </Link>
                  </div>
                </Header>
              </div>

              <div className="input__container">
                <InputBox
                  className="registration__input__item"
                  label="Email Address"
                  variant="standard"
                />

                <InputBox
                  className="registration__input__item"
                  label="Password"
                  variant="standard"
                />

                <CustomButton
                  className="reg__button"
                  buttonName={CommonButton}
                  title="Login to Continue"
                />

                <AuthenticationLink
                  className="auth__link__area"
                  href="/"
                  textTitle="Don't have an account ?"
                  textClassName="auth__text"
                  linkTitle="Sign Up"
                  linkClassName="auth__link"
                />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="registration__right">
            <Image
              className="registration__img"
              imageSource="assets/login__img.png"
              alt="login image"
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
