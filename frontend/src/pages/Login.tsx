import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Example icon - replace with your own image or SVG if desired
import appleDumbbellIcon from "../assets/appleDumbbellIcon.svg";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Login: React.FC<LoginProps> = ({ onViewChange }) => {
  const [error, setError] = useState<string | null>(null);

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", values);
      console.log("Login Successful:", response.data);

      // Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      // Navigate to the dashboard
      onViewChange("dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  

  // Inline styles for layout and elements
  const containerStyle: React.CSSProperties = {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  };

  const leftColumnStyle: React.CSSProperties = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: "#FFFFFF",
  };

  // const rightColumnStyle: React.CSSProperties = {
  //   flex: "1",
  //   backgroundColor: "#F5F9FB",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  // };

  const formContainerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "1rem",
    textAlign: "center",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.3rem",
    fontWeight: 500,
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: 600,
    backgroundColor: "#00C2C2",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "1rem",
  };

  const errorTextStyle: React.CSSProperties = {
    color: "red",
    fontSize: "0.9rem",
  };

  const signUpTextStyle: React.CSSProperties = {
    marginTop: "1rem",
    textAlign: "center",
  };

  // const iconStyle: React.CSSProperties = {
  //   width: "150px",
  //   height: "150px",
  // };

  return (
    <div style={containerStyle}>
      {/* Left Column: Login Form */}
      <div style={leftColumnStyle}>
        <div style={formContainerStyle}>
          <h2 style={headingStyle}>Log In to Your Account</h2>
          {error && <p style={errorTextStyle}>{error}</p>}

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {() => (
              <Form>
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="email" style={labelStyle}>
                    Email
                  </label>
                  <Field id="email" name="email" type="email" style={fieldStyle} />
                  <ErrorMessage name="email" render={(msg) => <div style={errorTextStyle}>{msg}</div>} />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="password" style={labelStyle}>
                    Password
                  </label>
                  <Field id="password" name="password" type="password" style={fieldStyle} />
                  <ErrorMessage name="password" render={(msg) => <div style={errorTextStyle}>{msg}</div>} />
                </div>

                <button type="submit" style={buttonStyle}>
                  Login
                </button>
              </Form>
            )}
          </Formik>

          <div style={signUpTextStyle}>
            <span>Don&apos;t have an account? </span>
            <button
              onClick={() => onViewChange("register")}
              style={{
                background: "none",
                border: "none",
                color: "#00C2C2",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Icon / Illustration */}
      <div style={{ width: "50%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#F5F9FB" }}>
  <img src={appleDumbbellIcon} alt="Apple Dumbbell Icon" style={{ width: "100%", height: "auto" }} />
</div>
    </div>
  );
};

export default Login;