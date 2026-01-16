import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";
import { useLoginMutation } from "../../app/features/auth/authApiSlice";
import { useAppDispatch } from "../../app/hooks/hooks";
import { setCredentials } from "../../app/features/auth/authSlice";
import Success from "../success/Success";
import { useThema } from "../../context/ThemaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {getErrorMessageForm} from "../../helpers/functions/errorHelper";
import useDebounce from "../../hooks/useDebounce";
import { isValidEmail,isValidPassword } from "./loginValidation";
import ErrorFormMessage from "../errors/ErrorFormMessage";


const LoginForm = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const debouncedForm=useDebounce({value:form, delay:1000});
  const [errMsg, setErrMsg] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [successMsg, setSuccessMsg] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const errRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const { thema } = useThema();
  const hasErrors=Object.values(errMsg).some(Boolean);
 
  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
  if (!debouncedForm.email) return;

  setErrMsg((e) => ({
    ...e,
    email: isValidEmail(debouncedForm.email)
      ? undefined
      : "Некорректный email",
  }));
}, [debouncedForm.email]);

useEffect(() => {
  if (!debouncedForm.password) return;

  setErrMsg((e) => ({
    ...e,
    password: isValidPassword(debouncedForm.password)
      ? undefined
      : "Некорректный пароль",
  }));
}, [debouncedForm.password]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password) {
  setErrMsg({ form: "Email and password are required" });
  return;
}

if (!isValidEmail(form.email)) {
  setErrMsg({ email: "Invalid email format" });
  return;
}

if (!isValidPassword(form.password)) {
  setErrMsg({ password: "Invalid password format" });
  return;
}
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
    } catch (err: unknown) {
      if (!(err as any)?.status) {
        setErrMsg({ form: "No server response" });
      } else {
        setErrMsg({ form: getErrorMessageForm(err, "Login failed") });
      }
      errRef.current?.focus();
    }
  };

  return (
    <section className={`login-container`}>
      {hasErrors && <ErrorFormMessage error={errMsg} ref={errRef} />}
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
