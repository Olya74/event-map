import { type FC } from "react";
import RegisterForms from "./RegisterForms";
import "./register.css";

const RegisterPage: FC = () => {
  return (
    <div className="register-page">
      <RegisterForms />
    </div>
  );
};

export default RegisterPage;
