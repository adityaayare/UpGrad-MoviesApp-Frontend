import React, { Fragment, useState } from "react";
import "./Header.css";
import logo from "../../assets/logo.svg";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Link } from "react-router-dom";

const Header = (props) => {
  const [IsLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("access-token") == null ? false : true
  );
  const [OpenLoginRegisterModal, setOpenLoginRegisterModal] = useState(false);
  const [ModalTabValue, setModalTabValue] = useState(0);
  const handleCloseLoginRegisterModal = () => setOpenLoginRegisterModal(false);
  const [LoginFormValues, setLoginFormValues] = useState({
    username: "",
    password: "",
  });

  const [UsernameRequired, setUsernameRequired] = useState(false);
  const [LoginPasswordRequired, setLoginPasswordRequired] = useState(false);

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleModalTabChange = (event, newValue) => {
    setModalTabValue(newValue);
  };

  const onLoginFormSubmit = (e) => {
    e.preventDefault();
    setUsernameRequired(LoginFormValues.username === "" ? true : false);

    setLoginPasswordRequired(LoginFormValues.password === "" ? true : false);

    fetch(props.baseUrl + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization:
          "Basic " +
          window.btoa(
            LoginFormValues.username + ":" + LoginFormValues.password
          ),
      },
    })
      .then((response) => {
        response.json();
        sessionStorage.setItem(
          "access-token",
          response.headers.get("access-token")
        );
      })
      .then((response) => {
        setIsLoggedIn(true);
        handleCloseLoginRegisterModal();
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("access-token");
    setIsLoggedIn(false);
  };

  return (
    <Fragment>
      <header className="topnav">
        <img
          src={logo}
          className="header-logo header-logo-animation"
          alt="header-logo"
        />
        {IsLoggedIn ? (
          <Button
            onClick={(e) => logoutHandler(e)}
            className="header-button"
            color="default"
            variant="contained"
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={(e) => setOpenLoginRegisterModal(true)}
            className="header-button"
            color="default"
            variant="contained"
          >
            Login
          </Button>
        )}

        {props.showBookShowButton === "true" && !IsLoggedIn ? (
          <div className="bookshow-button">
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => setOpenLoginRegisterModal(true)}
            >
              Book Show
            </Button>
          </div>
        ) : (
          ""
        )}

        {props.showBookShowButton === "true" && IsLoggedIn ? (
          <div className="bookshow-button">
            <Link to={"/bookshow/" + props.id}>
              <Button variant="contained" color="primary">
                Book Show
              </Button>
            </Link>
          </div>
        ) : (
          ""
        )}
      </header>
      <Modal
        ariaHideApp={false}
        isOpen={OpenLoginRegisterModal}
        contentLabel="Login"
        onRequestClose={handleCloseLoginRegisterModal}
        style={customModalStyles}
      >
        <Tabs
          className="tabs"
          value={ModalTabValue}
          onChange={handleModalTabChange}
          variant="fullWidth"
        >
          <Tab disableFocusRipple label="LOGIN" />
          <Tab disableFocusRipple label="REGISTER" />
        </Tabs>
        {ModalTabValue === 0 && (
          <div style={{ padding: 0, textAlign: "center" }}>
            <FormControl required>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                type="text"
                value={LoginFormValues.username}
                onChange={(e) => {
                  setLoginFormValues({
                    ...LoginFormValues,
                    username: e.target.value,
                  });
                }}
              />
              {UsernameRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="loginPassword">Password</InputLabel>
              <Input
                id="loginPassword"
                type="password"
                value={LoginFormValues.password}
                onChange={(e) => {
                  setLoginFormValues({
                    ...LoginFormValues,
                    password: e.target.value,
                  });
                }}
              />
              {LoginPasswordRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            {IsLoggedIn === true && (
              <FormControl>
                <span className="successText">Login Successful!</span>
              </FormControl>
            )}
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={onLoginFormSubmit}
            >
              LOGIN
            </Button>
          </div>
        )}
      </Modal>
    </Fragment>
  );
};

export default Header;
