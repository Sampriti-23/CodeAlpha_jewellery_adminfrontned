import React from "react";
import "./Front.css";
import {useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../reducer/AuthSlice";
import { useForm } from "react-hook-form";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(login(data)).then((res) => {
      if (res?.payload?.status_code === 200) {
        navigate("/home"); // ✅ redirect stays same
      }
    });
  };
  
  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="logo">Trinkets</div>

        <h2>Welcome back Admin!</h2>
        <p className="subtitle">Sign in to continue your journey</p>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}

          <button type="submit">Sign In</button>
        </form>

        <div className="footer">
          <span>Experiencing any issue? Report</span>
          <span>© 2026 Trinkets</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
      </div>

    </div>
  );
};

export default Login;