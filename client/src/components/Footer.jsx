import {
  HomeIcon,
  UserCircleIcon,
  BellSnoozeIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Cookie } from "../utils/cookie.js";
export default function Footer() {
  const navigate = useNavigate();
  const goTo = (path) => {
    return () => {
      if (window.location.pathname === path) {
      } else {
        navigate(path);
      }
    };
  };
  const isActive = (path) => window.location.pathname === path;
  return (
    <div className="btm-nav bottom-0 z-10  border-t-[1px] border-gray-800 border-solid bg-opacity-50 backdrop-filter backdrop-blur">
      <button
        onClick={goTo("/home")}
        className={`${isActive("/home") && "active"} text-white bg-gray-900`}
      >
        <HomeIcon className="h-5 w-5" />
      </button>
      <button
        onClick={goTo("/profile/" + Cookie.get("c_user"))}
        className={`${
          isActive("/profile/" + Cookie.get("c_user")) && "active"
        } text-white bg-gray-900`}
      >
        <UserCircleIcon className="h-5 w-5" />
      </button>
      <button
        onClick={goTo("/notifications/")}
        className={`${
          isActive("/notifications") && "active"
        } text-white bg-gray-900`}
      >
        <BellSnoozeIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
