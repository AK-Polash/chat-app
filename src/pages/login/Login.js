import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Heading from "../../components/Heading";
import InputBox from "../../components/InputBox";
import Image from "../../components/Image";
import AuthenticationLink from "../../components/AuthenticationLink";
import CustomButton from "../../components/CustomButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Vortex } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import "./login.css";

const LoginTextField = styled(TextField)({
  ".css-1c2i806-MuiFormLabel-root-MuiInputLabel-root": {
    top: "10px",
  },
  "& .css-aqpgxn-MuiFormLabel-root-MuiInputLabel-root": {
    top: "17px",
  },
  "& .css-whebh7-MuiInputBase-root-MuiInput-root:before": {
    borderBottom: "2px solid #CDCCDB",
  },
  "& .css-whebh7-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before":
    {
      borderBottom: "2px solid #dfe6e9",
    },
  "& .MuiFormLabel-root": {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    color: "#585D8E",
  },
  "& .MuiInputBase-root": {
    height: "70px",
    borderRadius: 10,
    padding: "0 40px",
  },
  "& .MuiInputBase-input": {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: "20px",
    fontWeight: "600",
    color: "#11175D",
    textAlign: "center",
  },
  "& label.Mui-focused": {
    color: "#585D8E",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B8B9CE",
  },
});

const LoginButton = styled(Button)({
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
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  let [show, setShow] = useState(false);
  let [disable, setDisable] = useState(false);
  let [loader, setLoader] = useState(false);
  let navigate = useNavigate();

  let [loginFormData, setLoginFormData] = useState({
    loginEmail: "",
    loginPassword: "",
  });

  let [loginErrMsg, setLoginErrMsg] = useState({
    emailErrMsg: "",
    passwordErrMsg: "",
  });

  let handleLoginFormData = (e) => {
    let { name, value } = e.target;

    setLoginFormData({ ...loginFormData, [name]: value });

    setLoginErrMsg({ emailErrMsg: "", passwordErrMsg: "" });
  };

  let handleLoginSubmit = () => {
    if (!loginFormData.loginEmail) {
      setLoginErrMsg({ ...loginErrMsg, emailErrMsg: "Email Required" });
    } else if (!loginFormData.loginPassword) {
      setLoginErrMsg({ ...loginErrMsg, passwordErrMsg: "Password Required" });
    } else {
      signInWithEmailAndPassword(
        auth,
        loginFormData.loginEmail,
        loginFormData.loginPassword
      )
        .then((userCredential) => {
          let user = userCredential.user;
          setLoginFormData({ loginEmail: "", loginPassword: "" });
          setDisable(true);

          if (user.emailVerified) {
            toast("Login Successful!");
            setLoader(true);

            setTimeout(() => {
              navigate("/home");
            }, 2500);
          } else {
            toast("Varify Your Email To Login!");

            setTimeout(() => {
              navigate(
                window.location.replace(
                  "https://mail.google.com/mail/u/0/#inbox"
                )
              );
            }, 2000);
          }
        })
        .catch((error) => {
          const errorCode = error.code;

          if (errorCode.includes("auth/user-not-found")) {
            setLoginErrMsg({
              ...loginErrMsg,
              emailErrMsg: "Incorrect Email Address",
            });
          }
          if (errorCode.includes("auth/wrong-password")) {
            setLoginErrMsg({
              ...loginErrMsg,
              passwordErrMsg: "Incorrect Password",
            });
          }
        });
    }
  };

  let handleGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      // // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // // The signed-in user info.
      // const user = result.user;

      navigate("/home");

      console.log("Google Done");
    });
    // .catch((error) => {
    //   // Handle Errors here.
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // The email of the user's account used.
    //   const email = error.customData.email;
    //   // The AuthCredential type that was used.
    //   const credential = GoogleAuthProvider.credentialFromError(error);
    //   // ...
    // });
  };

  return (
    <>
      <Grid container spacing={2}>
        <ToastContainer />
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
                        onClick={handleGoogle}
                        imageSource="assets/google__img.png"
                        alt="google image"
                      />
                    </Link>
                  </div>
                </Header>
              </div>

              <div className="input__container">
                <div className="input__wrapper">
                  <InputBox
                    className="registration__input__item"
                    label="Email Address"
                    variant="standard"
                    fieldName={LoginTextField}
                    type="email"
                    size="normal"
                    name="loginEmail"
                    onChange={handleLoginFormData}
                    value={loginFormData.loginEmail}
                  />

                  {loginErrMsg.emailErrMsg && (
                    <Alert
                      className="error__alert__message"
                      variant="filled"
                      severity="error"
                    >
                      {loginErrMsg.emailErrMsg}
                    </Alert>
                  )}
                </div>

                <div className="input__wrapper">
                  <InputBox
                    className="registration__input__item"
                    label="Password"
                    variant="standard"
                    fieldName={LoginTextField}
                    type={show ? "text" : "password"}
                    size="normal"
                    name="loginPassword"
                    onChange={handleLoginFormData}
                    value={loginFormData.loginPassword}
                  />

                  {show ? (
                    <AiFillEye
                      onClick={() => setShow(false)}
                      className="eye__pass reg__eye__pass"
                    />
                  ) : (
                    <AiFillEyeInvisible
                      onClick={() => setShow(true)}
                      className="eye__pass reg__eye__pass"
                    />
                  )}

                  {loginErrMsg.passwordErrMsg && (
                    <Alert
                      className="error__alert__message"
                      variant="filled"
                      severity="error"
                    >
                      {loginErrMsg.passwordErrMsg}
                    </Alert>
                  )}
                </div>

                <CustomButton
                  className="reg__button"
                  buttonName={LoginButton}
                  title="Login to Continue"
                  type="submit"
                  onClick={handleLoginSubmit}
                  disabled={disable}
                />

                {loader && (
                  <Vortex
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{ width: "130px", height: "130px" }}
                    wrapperClass="vortex-wrapper loader"
                    colors={[
                      "red",
                      "green",
                      "blue",
                      "yellow",
                      "orange",
                      "purple",
                    ]}
                  />
                )}

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
