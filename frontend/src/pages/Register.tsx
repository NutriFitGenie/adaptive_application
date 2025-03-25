import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import appleDumbbellIcon from "../assets/appleDumbbellIcon.svg";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterProps {
  onViewChange: (view: "login" | "register" | "onboarding" | "dashboard") => void;
}

const Register: React.FC<RegisterProps> = ({ onViewChange }) => {
  const [error, setError] = useState<string | null>(null);

  const initialValues: RegisterFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await axios.post("http://localhost:3000/api/users/register", values);
      console.log("Registration Successful:", response.data);
      onViewChange("onboarding");
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setError(err.response.data.message || "User already exists.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Column: Registration Form */}
      <div
        style={{
          width: "50%",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Create an Account
        </h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="firstName" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>
                  First Name
                </label>
                <Field id="firstName" name="firstName" style={{ width: "100%", padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }} />
                <ErrorMessage name="firstName" render={(msg) => <div style={{ color: "red", fontSize: "0.9rem" }}>{msg}</div>} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="lastName" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>
                  Last Name
                </label>
                <Field id="lastName" name="lastName" style={{ width: "100%", padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }} />
                <ErrorMessage name="lastName" render={(msg) => <div style={{ color: "red", fontSize: "0.9rem" }}>{msg}</div>} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="email" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>
                  Email
                </label>
                <Field id="email" name="email" type="email" style={{ width: "100%", padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }} />
                <ErrorMessage name="email" render={(msg) => <div style={{ color: "red", fontSize: "0.9rem" }}>{msg}</div>} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="password" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 500 }}>
                  Password
                </label>
                <Field id="password" name="password" type="password" style={{ width: "100%", padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }} />
                <ErrorMessage name="password" render={(msg) => <div style={{ color: "red", fontSize: "0.9rem" }}>{msg}</div>} />
              </div>
              <button
                type="submit"
                style={{
                  padding: "0.75rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  backgroundColor: "#00c2c2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "1rem",
                  width: "100%",
                }}
              >
                Begin Onboarding
              </button>
            </Form>
          )}
        </Formik>
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onViewChange("login")}
            style={{
              background: "none",
              border: "none",
              color: "#00c2c2",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Log In
          </button>
        </p>
      </div>

      {/* Right Column: Logo / Illustration */}
      <div
        style={{
          width: "50%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F9FB",
        }}
      >
        <img
          src={appleDumbbellIcon}
          alt="Apple Dumbbell Icon"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default Register;