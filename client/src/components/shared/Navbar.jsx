import { useRef, useState, useEffect, memo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Search from "./Search";
import { logoutAction } from "../../redux/actions/authActions";
import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { HiOutlineHome } from "react-icons/hi2";
import Logo from "../../assets/SocialEcho.png";
import NotificationDropdown from "./NotificationDropdown";
import CurrentTime from "./CurrentTime";

const Navbar = ({ userData }) => {
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => setShowDropdown(!showDropdown);

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <nav className="sticky top-0 z-20 mb-5 flex justify-between items-center bg-white p-2 md:px-36">
      {/* Logo */}
      <Link to="/" className="hidden md:inline-block">
        <img className="w-36" src={Logo} alt="Logo" />
      </Link>

      {/* Search & Navigation */}
      <div className="flex items-center gap-4">
        <Link
          to="/home"
          className="flex items-center gap-2 text-lg font-medium hover:text-primary"
        >
          <HiOutlineHome className="text-xl" />
          <span className="hidden md:inline">Home</span>
        </Link>

        <Search className="w-40 md:w-64" />

        {/* Notification pour modérateurs */}
        {userData?.role === "moderator" && (
          <NotificationDropdown userId={userData._id} />
        )}
      </div>

      {/* Dropdown utilisateur */}
      <div className="relative flex justify-end md:w-36">
        <button
          type="button"
          onClick={handleProfileClick}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all"
        >
          <img
            src={userData?.avatar}
            alt="profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        </button>

        <Transition
          show={showDropdown}
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {() => (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
            >
              <div className="py-1 px-4">
                <div className="flex flex-col items-center">
                  <img
                    src={userData?.avatar}
                    alt="profile"
                    className="mb-2 h-16 w-16 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="text-sm font-semibold text-gray-700 hover:underline">
                    <Link to={`/profile`}>{userData?.name}</Link>
                  </div>
                  <div className="text-sm text-gray-500">{userData?.email}</div>
                  <Link
                    to={`/profile`}
                    className="mt-1 text-sm text-blue-500 hover:underline"
                  >
                    View Profile
                  </Link>
                </div>

                <hr className="my-2" />

                {/* Horloge */}
                <CurrentTime />

                <hr className="my-2" />

                <div className="flex items-center justify-around p-2">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors py-2 px-4 rounded-md hover:bg-red-50"
                    onClick={logout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "Logging out..." : <>
                      Logout <IoLogOutOutline />
                    </>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </div>
    </nav>
  );
};

export default memo(Navbar);
