import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

interface RegisterProps {
  // Function passed from parent (e.g., App) to change the view
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Register: React.FC<RegisterProps> = ({ onViewChange }) => {
  const [error, setError] = useState<string | null>(null);

  const initialValues: RegisterFormValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      // .env
      const response = await axios.post("http://localhost:3000/api/users/register", values);
      console.log("Registration Successful:", response.data);

      // After successful registration, navigate to "login" view
      onViewChange("login");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <div>
              <label>Username:</label>
              <Field type="text" name="username" />
              <ErrorMessage name="username" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
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
            <button type="submit">Register</button>
          </Form>
        )}
      </Formik>

      <p>
        Already have an account?{" "}
        <button type="button" onClick={() => onViewChange("login")}>
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;