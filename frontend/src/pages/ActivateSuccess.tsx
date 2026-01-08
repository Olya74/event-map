import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ActivateSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

   return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🎉 Your account has been successfully activated! You can now log in.</h2>
      <p>You will be redirected to the login page shortly.</p>
    </div>
  );
};

export default ActivateSuccess;
