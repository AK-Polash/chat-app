import React, { useState } from "react";
import Header from "../../components/Header";
import Heading from "../../components/Heading";
import InputBox from "../../components/InputBox";
import Image from "../../components/Image";
import AuthenticationLink from "../../components/AuthenticationLink";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CustomButton from "../../components/CustomButton";
import Alert from "@mui/material/Alert";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

  let [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  let handleForm = (e) => {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrorMsg({ emailError: "", fullNameError: "", passwordError: "" });
  };

  let [errorMsg, setErrorMsg] = useState({
    emailError: "",
    fullNameError: "",
    passwordError: "",
  });

  let handleSubmit = () => {
    if (!formData.email) {
      setErrorMsg({ ...errorMsg, emailError: "Email Required" });
    } else if (!formData.fullName) {
      setErrorMsg({ ...errorMsg, fullNameError: "Full Name Required" });
    } else if (!formData.password) {
      setErrorMsg({ ...errorMsg, passwordError: "Password Required" });
    } else {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((user) => {
          setFormData({ ...formData, email: "", fullName: "", password: "" });
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode.includes("auth/email-already-in-use")) {
            setErrorMsg({ ...errorMsg, emailError: "Email Already Exist" });
          }
        });
    }
  };

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
                  />

                  {errorMsg.emailError && (
                    <Alert
                      className="error__alert__message"
                      variant="filled"
                      severity="error"
                    >
                      {errorMsg.emailError}
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
                  />

                  {errorMsg.fullNameError && (
                    <Alert
                      className="error__alert__message"
                      variant="filled"
                      severity="error"
                    >
                      {errorMsg.fullNameError}
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
                  />
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

                  {errorMsg.passwordError && (
                    <Alert
                      className="error__alert__message"
                      variant="filled"
                      severity="error"
                    >
                      {errorMsg.passwordError}
                    </Alert>
                  )}
                </div>

                <CustomButton
                  className="reg__button"
                  buttonName={CommonButton}
                  title="Sign up"
                  type="submit"
                  onClick={handleSubmit}
                />

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
