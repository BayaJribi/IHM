import { useMemo, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineRectangleStack,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineBookmark,
} from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { GiTeamIdea } from "react-icons/gi";

const Leftbar = ({ showLeftbar }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.auth?.userData);
  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    dispatch(getJoinedCommunitiesAction());
  }, [dispatch]);

  const visibleCommunities = useMemo(() => {
    return joinedCommunities?.slice(0, 5) || [];
  }, [joinedCommunities]);

  const communityLinks = useMemo(() => {
    return visibleCommunities?.map((community) => ({
      href: `/community/${community.name}`,
      label: community.name,
      icon: community.icon || "🏠",
    }));
  }, [visibleCommunities]);

  // Links array for the navigation menu
  const navigationLinks = [
   
    { href: "/saved", label: "Saved", icon: <HiOutlineTag className="text-xl" /> },
  ];

  

  // Check if the current route matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`${showLeftbar ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
                    leftbar transition-transform duration-300 ease-in-out bg-white rounded-lg shadow-sm p-4`}>
      <div className="flex flex-col justify-start items-center">
        <div className="flex flex-col items-start gap-2 w-full">
          {/* Navigation Links */}
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              className={`flex items-center gap-2 text-base font-medium w-full p-2 rounded-lg transition-colors
                        ${isActive(link.href) 
                          ? "bg-blue-50 text-primary" 
                          : "hover:bg-gray-100 hover:text-primary"}`}
              to={link.href}
            >
              {link.icon}
              <p>{link.label}</p>
            </Link>
          ))}

          <hr className="w-full my-4 border-gray-200" />

          {/* Communities Section */}
          {communityLinks && communityLinks.length > 0 ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1 font-medium items-center">
                  <HiOutlineUserGroup className="text-xl" />
                  <span>Communities</span>
                </div>

                <Link
                  className="flex relative items-center text-sm font-medium text-primary"
                  to="/my-communities"
                >
                  See all
                  <span className="absolute -top-2 -right-4 text-white text-xs bg-primary w-5 h-5 rounded-full flex justify-center items-center">
                    {joinedCommunities?.length || 0}
                  </span>
                </Link>
              </div>

              <ul className="w-full space-y-1">
                {communityLinks.map((communityLink) => (
                  <li key={communityLink.href}>
                    <Link
                      className={`flex items-center text-gray-600 font-medium gap-2 py-2 px-3 rounded-md
                              ${isActive(communityLink.href) 
                                ? "bg-blue-50 text-primary" 
                                : "hover:bg-gray-100 hover:text-primary"}`}
                      to={communityLink.href}
                    >
                      <span>{communityLink.icon}</span>
                      <span className="truncate">{communityLink.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-gray-500 italic p-2">No communities found.</div>
          )}

          {/* Explore Communities Link for General Users */}
          {user && user.role === "general" && (
            <>
              <hr className="w-full my-4 border-gray-200" />
              <div className="w-full bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-center gap-2 items-center">
                  <GiTeamIdea className="text-primary text-xl" />
                  <Link to="/communities" className="text-primary font-medium hover:underline">
                    Explore communities
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Leftbar);