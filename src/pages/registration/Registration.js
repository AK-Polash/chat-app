import React, { useState } from "react";
import Header from "../../components/Header";
import Heading from "../../components/Heading";
import InputBox from "../../components/InputBox";
import Image from "../../components/Image";
import AuthenticationLink from "../../components/AuthenticationLink";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CustomButton from "../../components/CustomButton";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Vortex } from "react-loader-spinner";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import "./registration.css";

const MyTextField = styled(TextField)({
  "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
    top: "17px",
    transform: "translate(17px, 15px) scale(1) !important",
  },
  "& .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root": {
    transform: "translate(17px, -9px) scale(.8) !important",
  },
  "& .MuiFormLabel-root": {
    fontFamily: "'Nunito', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    color: "#585D8E",
  },
  "& .MuiInputBase-root": {
    height: "81.7px",
    borderRadius: 10,
    padding: "0 27px",
  },
  "& .MuiInputBase-input": {
    fontFamily: "'Nunito', sans-serif",
    fontSize: "20px",
    fontWeight: "600",
    color: "#11175D",
    textAlign: "center",
  },
  "& label.Mui-focused": {
    color: "#585D8E",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "green",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#B8B9CE",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#dfe6e9",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#B8B9CE",
    },
  },
});

const CommonButton = styled(Button)({
  color: "#fff",
  borderRadius: "86px",
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

const Registration = () => {
  const auth = getAuth();
  let [show, setShow] = useState(false);
  let [disable, setDisable] = useState(false);
  let [progress, setProgress] = useState(0);
  let [progressStepColor, setProgressStepColor] = useState("#e74c3c");
  let [progressPresence, setProgressPresence] = useState(false);
  let [loader, setLoader] = useState(false);
  let navigate = useNavigate();

  let [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  let [errorMsg, setErrorMsg] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  // window.addEventListener("click", () => {
  //   setErrorMsg({ ...errorMsg, email: "", fullName: "", password: "" });
  // });

  let handleForm = (e) => {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrorMsg({ ...errorMsg, [name]: "" });

    if (name === "password") {
      let capitalPasswordRegex = /[A-Z]/;
      let smallPasswordRegex = /[a-z]/;
      let numberPasswordRegex = /[0-9]/;
      setProgressPresence(true);
      setProgress(0);

      if (!capitalPasswordRegex.test(value)) {
        setErrorMsg({
          ...errorMsg,
          password: "At lest One Capital Letter Required",
        });
        setDisable(true);
        return;
      } else {
        setDisable(false);
        setProgress(25);
        setProgressStepColor("#e74c3c");
      }

      if (!smallPasswordRegex.test(value)) {
        setErrorMsg({
          ...errorMsg,
          password: "At lest One Small Letter Required",
        });
        setDisable(true);
        return;
      } else {
        setDisable(false);
        setProgress(50);
        setProgressStepColor("#f1c40f");
      }

      if (!numberPasswordRegex.test(value)) {
        setErrorMsg({
          ...errorMsg,
          password: "At lest One Number Required",
        });
        setDisable(true);
        return;
      } else {
        setDisable(false);
        setProgress(75);
        setProgressStepColor("#2ecc71");
      }

      if (value.length < 8) {
        setErrorMsg({
          ...errorMsg,
          password: "At lest 8 Character Required",
        });
        setDisable(true);
        return;
      } else {
        setDisable(false);
        setProgress(100);
        setProgressStepColor("lime");
      }
    }
  };

  let handleSubmit = () => {
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let userNameRegex =
      /^([a-zA-Z0-9]+|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{1,}|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{3,}\s{1}[a-zA-Z0-9]{1,})$/g;

    if (!formData.email) {
      setErrorMsg({ ...errorMsg, email: "Email Required" });
    } else if (!emailRegex.test(formData.email)) {
      setErrorMsg({ ...errorMsg, email: "Valid Email Required" });
    } else if (!formData.fullName) {
      setErrorMsg({ ...errorMsg, fullName: "Full Name Required" });
    } else if (!userNameRegex.test(formData.fullName)) {
      setErrorMsg({ ...errorMsg, fullName: "Valid Name Required" });
    } else if (!formData.password) {
      setErrorMsg({ ...errorMsg, password: "Password Required" });
    } else {
      setProgressPresence(false);
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((user) => {
          setFormData({ ...formData, email: "", fullName: "", password: "" });
          setDisable(true);
          setLoader(true);

          sendEmailVerification(auth.currentUser).then(() => {
            toast("Registration Successful!");

            setTimeout(() => {
              toast("Varification Email Sent!");
            }, 600);

            setTimeout(() => {
              setLoader(false);
            }, 1700);

            setTimeout(() => {
              navigate("/login");
            }, 2000);
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode.includes("auth/email-already-in-use")) {
            setErrorMsg({ ...errorMsg, email: "Email Already Exist" });
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
                    title="Get started with easily register"
                  />
                  <p className="sub__heading">
                    Free register and you can enjoy it
                  </p>
                </Header>
              </div>

              <div className="input__container">
                <div className="input__wrapper">
                  <InputBox
                    className="registration__input__item"
                    label="Email Address"
                    variant="outlined"
                    fieldName={MyTextField}
                    type="email"
                    size="normal"
                    name="email"
                    onChange={handleForm}
                    value={formData.email}
                  />

                  {errorMsg.email && (
                    <Alert
                      className="error__alert__message"
                      variant="filled"
                      severity="error"
                    >
                      {errorMsg.email}
                    </Alert>
                  )}
                </div>

                <div className="input__wrapper">
                  <InputBox
                    className="registration__input__item"
                    label="Full Name"
                    variant="outlined"
                    fieldName={MyTextField}
                    type="text"
                    size="normal"
                    name="fullName"
                    onChange={handleForm}
                    value={formData.fullName}
                  />

                  {errorMsg.fullName && (
                    <Alert
                      className="error__alert__message"
                      variant="filled"
                      severity="error"
                    >
                      {errorMsg.fullName}
                    </Alert>
                  )}
                </div>

                <div className="input__wrapper">
                  <InputBox
                    className="registration__input__item"
                    label="Password"
                    variant="outlined"
                    fieldName={MyTextField}
                    type={show ? "text" : "password"}
                    size="normal"
                    name="password"
                    onChange={handleForm}
                    value={formData.password}
                  />

                  {progressPresence && (
                    <LinearProgress
                      sx={{
                        width: "100%",
                        position: "absolute",
                        bottom: "38px",
                        left: "0",
                        borderRadius: "30px",
                        background: "lightblue",
                        "& .css-5xe99f-MuiLinearProgress-bar1": {
                          backgroundColor: `${progressStepColor}`,
                        },
                      }}
                      variant="determinate"
                      value={progress}
                    />
                  )}

                  {show ? (
                    <AiFillEye
                      onClick={() => setShow(false)}
                      className="eye__pass"
                    />
                  ) : (
                    <AiFillEyeInvisible
                      onClick={() => setShow(true)}
                      className="eye__pass"
                    />
                  )}

                  {errorMsg.password && (
                    <Alert
                      className="error__alert__message"
                      variant="filled"
                      severity="error"
                    >
                      {errorMsg.password}
                    </Alert>
                  )}
                </div>

                <CustomButton
                  className="reg__button"
                  buttonName={CommonButton}
                  title="Sign up"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={disable}
                />

                {loader && (
                  <Vortex
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
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
                  href="/login"
                  textTitle="Already  have an account ?"
                  textClassName="auth__text"
                  linkTitle="Sign In"
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
              imageSource="assets/registration__img.png"
              alt="registration image"
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Registration;
