import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import "../styles/login.css";

interface LoginFormValues {
  email: string;
  password: string;
}

// Props from parent
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

      // Example response: { message: 'Login successful.', token: '...', user: {...} }

      // 1. Store JWT token in localStorage
      localStorage.setItem("token", response.data.token); 


      // 3. Navigate to the dashboard
      onViewChange("dashboard");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <div>
              <label>Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <button type="submit">Login</button>
          </Form>
        )}
      </Formik>

      <p>
        Don&apos;t have an account?{" "}
        <button onClick={() => onViewChange("register")} style={{ cursor: "pointer" }}>
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;