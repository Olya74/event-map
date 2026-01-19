import { NavLink,useNavigate  } from "react-router-dom";
import logo from "/bg1.png";
import { useAppSelector } from "../../app/hooks/hooks";
import { selectedCurrentUser } from "../../app/features/auth/authSlice";
import { useThema } from "../../context/ThemaContext";
import ThemaButton from "../buttons/ThemaButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightFromBracket,
  faArrowRightToBracket,
  faHome,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import { useLogoutMutation } from "../../app/features/auth/authApiSlice";
import { useState } from "react";

function Header() {
  const { thema } = useThema();
  const navigate = useNavigate();
  const user = useAppSelector(selectedCurrentUser);
  const [logout] = useLogoutMutation();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  }
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className={`w-full header ${thema} p-4`}>
      {/* CONTAINER */}
      <div
        className="
        mx-auto 
        gap-2
        sm:px-6 lg:px-12
        min-h-20
        flex flex-col  items-center justify-between min-[150px]:flex-row 
      "
      >
        {/* LOGO */}
        <img
          src={logo}
          alt="logo"
          className="h-12 w-12 rounded-full shrink-0"
        />

        {/* NAV */}
        <nav className="flex items-center  min-[165px]:w-full min-[165px]:justify-between min-[105px]:gap-2 lg:text-xl  md:mx-6">
          {/* LEFT */}
          <ul className="flex items-center min-[105px]:gap-4">
            {/* Desktop */}
            <li className="max-md:hidden md:block border-r pr-4 border-gray-400 hover:text-blue-500 hover:text-3xl transition-colors ">
              <NavLink to="/">Start Page</NavLink>
            </li>

            <li className="max-md:hidden md:block border-r pr-4 border-gray-400 hover:text-blue-500 hover:text-3xl transition-colors">
              <NavLink to="/events">Browse Events</NavLink>
            </li>

            <li className="max-md:hidden md:block border-r pr-4 border-gray-400 hover:text-blue-500 hover:text-3xl transition-colors">
              <NavLink to="/map">View Map</NavLink>
            </li>

            {/* Mobile menu */}
            <li className="min-md:hidden" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faList} className={`text-xl  ${thema}`} />
              {showMenu && (
                <ul className={`z-[1005] absolute top-20 left-4 ${ thema === "light" ? "bg-gray-200 " : "bg-gray-700"} shadow-lg rounded-md py-2 w-40 z-50`}>
                  <li className={`px-4 py-2  ${ thema === "light" ? "hover:bg-gray-400 hover:text-amber-50 " : "hover:bg-gray-400"}  hover:border-l-blue-500 hover:border-l-4`}>
                    <NavLink to="/events" onClick={toggleMenu}>Browse Events</NavLink>
                  </li>
                  <li className={`px-4 py-2  ${ thema === "light" ? "hover:bg-gray-400 hover:text-amber-50 " : "hover:bg-gray-400"}  hover:border-l-blue-500 hover:border-l-4`}>
                    <NavLink to="/map" onClick={toggleMenu}>View Map</NavLink>
                  </li>
                </ul>
              )}  
            </li>
            <li className="min-md:hidden">
              <NavLink to="/"><FontAwesomeIcon icon={faHome} className={`text-xl ${thema}`} /></NavLink>
            </li>
          </ul>

          {/* RIGHT */}
          {user ? (
            <ul className="flex items-center min-[105px]:gap-2 ">
              <li className="max-[150px]:hidden   max-sm:text-sm  ">
                Welcome <span className="font-medium">{user.name}</span>
              </li>

              <li className="max-md:hidden md:block">
                <NavLink to="/profile">My Profile</NavLink>
              </li>

              {/* Mobile icons */}
              <li className="min-md:hidden">
                <NavLink to="/profile">
                  <FontAwesomeIcon
                    icon={faUser}
                    className={`text-xl ${thema}`}
                  />
                </NavLink>
              </li>

              <li
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2"
              >
                <button className="max-md:hidden md:block buttonLogout">
                  Logout
                </button>

                <button className="sm:block md:hidden ">
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className={`text-xl ${thema}`}
                  />
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex items-center gap-4">
              <li className="max-md:hidden md:block">
                <NavLink to="/login">Login</NavLink>
              </li>
              <li className="max-md:hidden md:block">
                <NavLink to="/register">Register</NavLink>
              </li>

              <li className=" min-md:hidden">
                <NavLink to="/login">
                  <FontAwesomeIcon
                    icon={faArrowRightToBracket}
                    className={`text-xl ${thema}`}
                  />
                </NavLink>
              </li>
            </ul>
          )}
        </nav>

        {/* THEME */}
        <ThemaButton />
      </div>
    </header>
  );
}

export default Header;
