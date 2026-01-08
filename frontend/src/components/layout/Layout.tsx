import { Outlet } from "react-router-dom";
import "./layout.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useThema } from "../../context/ThemaContext";
const Layout = () => {
  const { bgClass } = useThema();

  return (
    <div className={`layout ${bgClass}`}>
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
