import React, { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { NavLink } from "react-router-dom";
import "./register.css";
import { useRegisterMutation } from "../../app/features/auth/authApiSlice";
import { useThema } from "../../context/ThemaContext";
import { useResize } from "../../helpers/useResize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../errors/ErrorMessage";
import Success from "../success/Success";
import { getErrorMessage } from "../../helpers/functions/errorHelper";
import useDebounce from "../../hooks/useDebounce";

const RegisterForms = () => {
  const { thema } = useThema();
  const [register] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
    const debouncedEmail = useDebounce({ value: form.email, delay: 500 });
  const debouncedPassword = useDebounce({ value: form.password, delay: 500 });
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef<HTMLDivElement>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const userRef = useRef<HTMLInputElement>(null);
  const { isSM } = useResize();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrMsg("");
      setSuccessMsg("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [form.email, form.password, confirmPassword, captchaToken, form.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (form.password !== confirmPassword) {
        setErrMsg(() => "Passwords do not match");
        errRef.current?.focus();
        return;
      }
      await register({
        ...form,
        captcha: captchaToken,
      }).unwrap();
      setForm({ name: "", email: "", password: "" });
      setConfirmPassword("");
      setSuccessMsg(
        "Registration successful! Redirecting to home...Check your email to activate your account."
      );
      successRef.current?.focus();
      if (successMsg) {
        setTimeout(() => {
          setCaptchaToken("");
        }, 2000);
      }
    } catch (err: any) {
      if (!err?.status) {
       setErrMsg(getErrorMessage(err, "No server response"));
      } else {
        setErrMsg(getErrorMessage(err, "Registration failed"));
      }
      errRef.current?.focus();
    }
  };

  return (
    <section className="register-container">
      {errMsg && <ErrorMessage error={errMsg} ref={errRef} />}
      {successMsg && <Success success={successMsg} ref={successRef} />}
      <div className={`${captchaToken ? "hidden" : `captcha ${thema}`}`}>
        <HCaptcha
          size={captchaToken ? "invisible" : isSM ? "compact" : "normal"}
          sitekey={import.meta.env.VITE_HCAPTCHA_PROD_KEY}
          onVerify={(token) => {
            setCaptchaToken(token);
          }}
        />
      </div>
      <form onSubmit={handleSubmit} className={`formRegister ${thema}`}>
        <div className="formR-name">
          <label htmlFor="name">Name:&nbsp; </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="name"
            required
          />
        </div>
        <div className="formR-name">
          <label htmlFor="email">Email:&nbsp;</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="email"
            required
          />
        </div>
        <div className="formR-name">
          <label htmlFor="password">Password:&nbsp; </label>
          <div className="password-wrapper">
            <input
              className="password-input"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              placeholder="password"
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="password-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="formR-name">
          <label htmlFor="confirmPassword">Confirm Password:&nbsp; </label>
          <div className="password-wrapper">
            <input
              className="password-input"
              value={confirmPassword}
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="confirm password"
              required
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEye : faEyeSlash}
              className="password-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!captchaToken}
          className={`register-button ${thema}`}
        >
          Register
        </button>
      </form>
      <div className={`go-to-login go-to-login-${thema}`}>
        <p>Don't have an account?</p>
        <NavLink to="/login" className={`go-to-login-link ${thema}`}>
          Go to login
        </NavLink>
      </div>
    </section>
  );
};

export default RegisterForms;
