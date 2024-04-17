import React, { useRef, useState } from "react";
import { Container, Row, Form, Button, Stack } from "react-bootstrap";
import { FaLock, FaSignInAlt } from "react-icons/fa";
import "./Signup.css";
import axios from "axios"

const Signup = () => {
  const [isToggle, setIsToggle] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const toggleFormHandler = () => {
    setIsToggle(!isToggle);
  };

  const loginHandler = async (e) => {

    e.preventDefault();

    try {

      const loginData = {
        email : emailRef.current.value,
        password : passwordRef.current.value
    }
   
     
    const headers = {
      "Content-Type" : "application/json",
    }
    const res = await axios.post("http://localhost:5000/user/login",loginData,{headers});

    console.log("res form  login handler : ",res);

    alert("Login Sucessful!");

    clearLoginFormDetails();


    } catch (err) {
      console.log("Err during login client : ",err);
    }
  }

  const signUpHandler = async (e) => {
  
    e.preventDefault();
     
    try {

      let signUpData;

      if (passwordRef.current.value===confirmPasswordRef.current.value) {
         signUpData = {
            username : nameRef.current.value,
            email : emailRef.current.value,
            password : passwordRef.current.value
        }
    } else {
        return(
            alert("Passwords do not match")
        );
    }

    const headers = {
      "Content-Type" : "application/json",
    }

    const res = await axios.post("http://localhost:5000/user/signup",signUpData,{headers});

    console.log("res form  sign up handler : ",res);

    alert("User has been created successfully,Please login now!");

    clearSignUpFormDetails();

    } catch(err) {

      console.log("Err during sign up client : ",err);

    }
  
  }

  const clearSignUpFormDetails = () => {
    nameRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value="";
    confirmPasswordRef.current.value="";
  }

  const clearLoginFormDetails = () => {
    emailRef.current.value = "";
    passwordRef.current.value="";
  }

  return (
    <Container className="mt-5 body-img">
      <Container className="mt-5 mb-5">
        <div className="brand-slogan">ChatCircle - Connect with Friends and Family Anytime, Anywhere!</div>
      </Container>
      <Container >
        {isToggle ? (
          <Form className="sign-up-form mx-auto" onSubmit={signUpHandler}>
            <Form.Group as={Row} >
              <Form.Label htmlFor="name"  className="form-label">
                Username
              </Form.Label>
              <Form.Control type="text" id="name" ref={nameRef} className="m-2"/>
              <Form.Label htmlFor="email"  className="form-label">
                Email
              </Form.Label>
              <Form.Control type="email" id="email" ref={emailRef} className="m-2"/>
              <Form.Label htmlFor="password"  className="form-label">
                Password
              </Form.Label>
              <Form.Control type="password" id="password" ref={passwordRef} className="m-2" />
              <Form.Label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </Form.Label>
              <Form.Control type="password" id="confirm-password" ref={confirmPasswordRef} className="m-2" />
              <Button type="submit" className="signup-btn mx-auto m-2">
                <Stack direction="horizontal" className="sign-up-stack" gap={2}>
                  <div className="signup-btn-txt">Signup</div>
                  <div className="signup-btn-div" >
                    <FaLock className="signup-btn-icon" />
                  </div>
                </Stack>
              </Button>
              <Stack direction="horizontal" gap={2} className="signup-footer-stack m-2">
                <div className="signup-footer-txt">Already an existing user ?</div>
                <div onClick={toggleFormHandler} className="signup-footer-txt-link"
                ><a>Log in</a></div>
              </Stack>
            </Form.Group>
          </Form>
        ) : (
          <Form className="sign-up-form mx-auto" onSubmit={loginHandler}>
            <Form.Group as={Row}>
              <Form.Label htmlFor="email" column sm="2" className="form-label">
                Email
              </Form.Label>
              <Form.Control type="email" id="email" ref={emailRef} className="m-2"/>
              <Form.Label htmlFor="password" column sm="2" className="form-label">
                Password
              </Form.Label>
              <Form.Control type="password" id="password"  ref={passwordRef}  className="m-2"/>
            </Form.Group>
            <Button type="submit" className="signin-btn mx-auto m-2">
              <Stack direction="horizontal" gap={2} className="sign-up-stack">
                <div className="signup-btn-txt">Login</div>
                <div className="signup-btn-div">
                  <FaSignInAlt className="signup-btn-icon" />
                </div>
              </Stack>
            </Button>
            <Stack direction="horizontal" gap={2} className="signup-footer-stack m-2">
              <div className="signup-footer-txt">Don't have an account ?</div>
              <div onClick={toggleFormHandler} className="signup-footer-txt-link">Sign Up</div>
            </Stack>
          </Form>
        )}
      </Container>
    </Container>
  );
};

export default Signup;
