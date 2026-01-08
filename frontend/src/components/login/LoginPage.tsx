import type { FC } from "react";
import LoginForm from "./LoginForm";
import "./login.css";

const LoginPage: FC = () => {
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
};
export default LoginPage;
