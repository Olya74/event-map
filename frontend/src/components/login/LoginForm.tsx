import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";
import { useLoginMutation } from "../../app/features/auth/authApiSlice";
import { useAppDispatch } from "../../app/hooks/hooks";
import { setCredentials } from "../../app/features/auth/authSlice";
import ErrorMessage from "../errors/ErrorMessage";
import Success from "../success/Success";
import { useThema } from "../../context/ThemaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getErrorMessage } from "../../helpers/functions/errorHelper";

const LoginForm = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const errRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const { thema } = useThema();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
    setSuccessMsg("");
  }, [form.email, form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(form).unwrap();
      const userData = response.userData;
      dispatch(
        setCredentials({
          user: userData.user,
          accessToken: userData.accessToken,
        })
      );
      setSuccessMsg("Login successful");
      successRef.current?.focus();
      setTimeout(() => {
        setForm({ email: "", password: "" });
        navigate("/profile");
      }, 1000);
    } catch (err: any) {
      if (!err?.status) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(getErrorMessage(err, "Login failed"));
      }
      errRef.current?.focus();
    }
  };

  return (
    <section className={`login-container`}>
      {errMsg && <ErrorMessage error={errMsg} ref={errRef} />}
      {successMsg && <Success success={successMsg} ref={successRef} />}
      <form onSubmit={handleSubmit} className={`formLogin ${thema}`}>
        <div className="form-name">
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="email"
            required
            autoComplete="off"
            ref={userRef}
          />
        </div>
        <div className="form-name">
          <label htmlFor="password">Password: </label>
          <div className="login-password-wrapper">
            <input
              className="login-pssword-input"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              placeholder="password"
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="login-password-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <button className={`btnLog ${thema}`} type="submit">
          login
        </button>
      </form>
      <div className={`go-to-register ${thema}`}>
        <p className="auth-text">
          <span>Already</span>
          <span>have</span>
          <span>an</span>
          <span>account?</span>
        </p>
        <NavLink to="/register" className={`go-to-register-link ${thema}`}>
          Go to register
        </NavLink>
      </div>
    </section>
  );
};

export default LoginForm;
