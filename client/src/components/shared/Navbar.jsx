import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Search from "./Search";
import { memo } from "react";
import { logoutAction } from "../../redux/actions/authActions";
import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { AiOutlineBars } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { BsMessenger } from "react-icons/bs";
import { HiOutlineUserGroup, HiOutlineHome, HiOutlineUserCircle } from "react-icons/hi2";
import Logo from "../../assets/SocialEcho.png";
import CurrentTime from "./CurrentTime"; // Import the CurrentTime component

const Navbar = ({ userData, toggleLeftbar, showLeftbar }) => {
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

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

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-20 mb-5 flex flex-col bg-white shadow-sm">
      {/* Main Navbar */}
      <div className="flex justify-between items-center p-2 md:px-36">
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-500 hover:text-primary"
          onClick={toggleLeftbar}
        >
          {showLeftbar ? (
            <RxCross1 className="text-xl" />
          ) : (
            <AiOutlineBars className="text-xl" />
          )}
        </button>

        {/* Logo (hidden on small screens) */}
        <Link to="/" className="hidden md:inline-block">
          <img className="w-36" src={Logo} alt="SocialEcho Logo" />
        </Link>

        {/* Left section: Search */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-40 md:w-64" />
          </div>
        </div>

        {/* Right section: Messenger, Following, and Profile */}
        <div className="relative flex items-center gap-4 justify-end">
          {/* Navigation Links */}
          <Link
            to="/home"
            className="hidden md:flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
          >
            <HiOutlineHome className="text-xl" />
            <span className="hidden md:inline">Home</span>
          </Link>

          {/* Messenger Icon */}
          <Link 
            to="/messenger" 
            className="hover:text-primary text-xl transition-colors relative"
            aria-label="Messages"
          >
            <BsMessenger />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Following Icon */}
          <Link 
            to="/following" 
            className="hover:text-primary text-xl transition-colors"
            aria-label="Following"
          >
            <HiOutlineUserGroup />
          </Link>

          {/* Profile Avatar */}
          <button
            type="button"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all"
            onClick={handleProfileClick}
            aria-label="Profile menu"
          >
            <img
              src={userData?.avatar}
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </button>

          {/* Profile Dropdown */}
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
                className="absolute right-0 top-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="py-1" role="none">
                  <div className="flex flex-col items-center p-4">
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
                      className="mt-2 text-sm text-blue-500 hover:underline hover:text-blue-700"
                    >
                      View Profile
                    </Link>
                  </div>

                  <hr className="my-2" />
                  
                  {/* Time display */}
                  <div className="px-4 py-2">
                    <CurrentTime />
                  </div>
                  
                  <hr className="my-2" />
                  
                  <div className="flex items-center justify-around p-2">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors py-2 px-4 rounded-md hover:bg-red-50"
                      onClick={logout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? (
                        <div className="text-center">Logging out...</div>
                      ) : (
                        <>
                          <span>Logout</span>
                          <IoLogOutOutline className="ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);