import { NavLink } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";

function Header() {
  const { thema } = useThema();
  const navigate = useNavigate();
  const user = useAppSelector(selectedCurrentUser);
  const [logout] = useLogoutMutation();
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
          <ul className="flex items-center min-[105px]:gap-4 ">
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
            <li className="min-md:hidden">
              <FontAwesomeIcon icon={faList} className={`text-xl  ${thema}`} />
            </li>
            <li className="min-md:hidden">
              <FontAwesomeIcon icon={faHome} className={`text-xl ${thema}`} />
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
