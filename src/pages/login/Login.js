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
  sendPasswordResetEmail,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { activeUser } from "../../slices/userSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
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

const ForgotPasswordTextField = styled(TextField)({
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
    height: "52px",
    borderRadius: 10,
    padding: "0 20px",
  },
  "& .MuiInputBase-input": {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: "16px",
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setLoginErrMsg({ forgotPasswordErrMsg: "" });
    {
      loginFormData.forgotPassword &&
        setLoginFormData({ ...loginFormData, forgotPassword: "" });
    }
  };
  const handleClose = () => setOpen(false);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  let [show, setShow] = useState(false);
  let [disable, setDisable] = useState(false);
  let [loader, setLoader] = useState(false);
  let navigate = useNavigate();
  let dispatch = useDispatch();

  let [loginFormData, setLoginFormData] = useState({
    loginEmail: "",
    loginPassword: "",
    forgotPassword: "",
  });

  let [loginErrMsg, setLoginErrMsg] = useState({
    emailErrMsg: "",
    passwordErrMsg: "",
    forgotPasswordErrMsg: "",
  });

  let handleLoginFormData = (e) => {
    let { name, value } = e.target;

    setLoginFormData({ ...loginFormData, [name]: value });

    setLoginErrMsg({
      ...loginErrMsg,
      emailErrMsg: "",
      passwordErrMsg: "",
      forgotPasswordErrMsg: "",
    });
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
          setLoginFormData({ loginEmail: "", loginPassword: "" });
          setDisable(true);

          dispatch(activeUser(userCredential.user));
          localStorage.setItem("userInfo", JSON.stringify(userCredential.user));

          if (userCredential.user.emailVerified) {
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
              emailErrMsg: "User Not Found",
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

  let handleForgotPassword = () => {
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!loginFormData.forgotPassword) {
      setLoginErrMsg({
        ...loginErrMsg,
        forgotPasswordErrMsg: "Email Address Required",
      });
    } else if (!emailRegex.test(loginFormData.forgotPassword)) {
      setLoginErrMsg({
        ...loginErrMsg,
        forgotPasswordErrMsg: "Enter a valid Email Address",
      });
    } else {
      sendPasswordResetEmail(auth, loginFormData.forgotPassword)
        .then(() => {
          toast("Recovery Email Sent!");
          setOpen(false);
        })
        .catch((error) => {
          if (error.code.includes("auth/missing-email")) {
            setLoginErrMsg({
              ...loginErrMsg,
              forgotPasswordErrMsg: "Missing Email",
            });
          }
          if (error.code.includes("auth/user-not-found")) {
            setLoginErrMsg({
              ...loginErrMsg,
              forgotPasswordErrMsg: "User Not Found",
            });
          }
        });
    }
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
                <AuthenticationLink
                  className="auth__link__area auth__link__forgot__password"
                  href="/login"
                  textTitle="Forgot Password ?"
                  textClassName="auth__text"
                  linkTitle="Click here"
                  linkClassName="auth__link"
                  onClick={handleOpen}
                />

                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 200,
                  }}
                >
                  <Fade in={open}>
                    <Box sx={style}>
                      <Typography
                        id="transition-modal-title"
                        variant="h6"
                        component="h3"
                        sx={{ marginBottom: "10px", fontSize: "24px" }}
                      >
                        Forgot Password
                      </Typography>
                      <div className="modal__main">
                        <InputBox
                          className="registration__input__item"
                          label="Email Address"
                          variant="standard"
                          fieldName={ForgotPasswordTextField}
                          type="email"
                          size="normal"
                          name="forgotPassword"
                          onChange={handleLoginFormData}
                          value={loginFormData.forgotPassword}
                        />

                        {loginErrMsg.forgotPasswordErrMsg && (
                          <Alert
                            className="error__alert__message  error__alert__forgot__password"
                            variant="filled"
                            severity="error"
                          >
                            {loginErrMsg.forgotPasswordErrMsg}
                          </Alert>
                        )}
                        <CustomButton
                          className="forgot__password__button"
                          buttonName={LoginButton}
                          title="Forgot Password"
                          type="submit"
                          onClick={handleForgotPassword}
                          disabled={false}
                        />
                      </div>
                    </Box>
                  </Fade>
                </Modal>
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
