import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  getPublicUsersAction,
  followUserAndFetchData,
} from "../../redux/actions/userActions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import JoinModal from "../modals/JoinModal";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoIosPeople, IoMdPeople } from "react-icons/io";
import { HiOutlineFilter, HiOutlineRefresh } from "react-icons/hi";
import placeholder from "../../assets/placeholder.png";
import CurrentTime from "./CurrentTime"; // Import CurrentTime component

const Rightbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [joinModalVisibility, setJoinModalVisibility] = useState({});
  const [notJoinedCommunitiesFetched, setNotJoinedCommunitiesFetched] = useState(false);
  const [publicUsersFetched, setPublicUsersFetched] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentUser = useSelector((state) => state.auth?.userData);
  const recommendedUsers = useSelector((state) => state.user?.publicUsers);

  const refreshData = async () => {
    setIsRefreshing(true);
    await dispatch(getNotJoinedCommunitiesAction());
    await dispatch(getPublicUsersAction());
    setIsRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getNotJoinedCommunitiesAction());
      setNotJoinedCommunitiesFetched(true);
      await dispatch(getPublicUsersAction());
      setPublicUsersFetched(true);
    };

    fetchData();
  }, [dispatch]);

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  const [visibleCommunities, remainingCount] = useMemo(() => {
    const visibleCommunities = notJoinedCommunities?.slice(0, 4) || [];
    const remainingCount = Math.max((notJoinedCommunities?.length || 0) - 4, 0);
    return [visibleCommunities, remainingCount];
  }, [notJoinedCommunities]);

  const [followLoading, setFollowLoadingState] = useState({});

  const followUserHandler = useCallback(
    async (toFollowId) => {
      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: true,
      }));

      await dispatch(followUserAndFetchData(toFollowId, currentUser));

      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: false,
      }));

      navigate(`/user/${toFollowId}`);
    },
    [dispatch, currentUser, navigate]
  );

  const toggleJoinModal = useCallback((communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  }, []);

  const currentLocation = useLocation().pathname;

  return (
    <div className="hidden md:block rightbar overflow-auto bg-white rounded-lg shadow-sm p-5">
  

      {/* Communities Section */}
      {currentLocation !== "/communities" && (
        <div className="mb-6">
          <div className="flex items-end justify-between mb-4">
            <h5 className="font-semibold text-sm uppercase text-gray-600">Suggested Communities</h5>
            <div className="flex items-center gap-2">
              <button 
                onClick={refreshData} 
                className="text-gray-500 hover:text-primary transition-colors"
                disabled={isRefreshing}
                aria-label="Refresh data"
              >
                <HiOutlineRefresh className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              {remainingCount > 0 && (
                <Link
                  className="flex relative items-center text-sm font-medium text-primary"
                  to="/communities"
                >
                  See all
                  <span className="absolute -top-2 -right-4 text-white text-xs bg-primary w-5 h-5 rounded-full flex justify-center items-center">
                    {remainingCount}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {notJoinedCommunitiesFetched && visibleCommunities.length === 0 && (
            <div className="text-center italic text-gray-400 p-4 bg-gray-50 rounded-lg">
              No communities to join. Check back later
            </div>
          )}
          
          <ul className="flex flex-col gap-3">
            {visibleCommunities?.map((community) => (
              <li
                key={community._id}
                className="flex items-center justify-between bg-white px-3 py-2 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={community.banner || placeholder}
                      className="h-full w-full object-cover"
                      alt={community.name}
                    />
                  </div>
                  <div className="text-base font-medium flex flex-col">
                    <p className="line-clamp-1">{community.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <IoMdPeople />
                      {community.members.length} members
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoinModal(community._id, true)}
                  className="text-primary border border-dashed border-blue-500
                        hover:bg-primary hover:text-white
                        rounded-md py-1 px-3 text-sm font-semibold transition duration-300"
                >
                  <p className="flex items-center gap-2">
                    <IoIosPeople className="text-lg" />
                    Join
                  </p>
                </button>
                
                <JoinModal
                  show={joinModalVisibility[community._id] || false}
                  onClose={() => toggleJoinModal(community._id, false)}
                  community={community}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr className="my-4" />

      {/* Users Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-sm font-semibold uppercase text-gray-600">Popular Users to Follow</h5>
          <button className="text-gray-500 hover:text-primary transition-colors">
            <HiOutlineFilter className="text-lg" />
          </button>
        </div>

        {publicUsersFetched && recommendedUsers?.length === 0 && (
          <div className="text-center italic text-gray-400 p-4 bg-gray-50 rounded-lg">
            No users to follow. Check back later
          </div>
        )}
        
        <ul className="flex flex-col gap-3">
          {recommendedUsers?.length > 0 &&
            recommendedUsers.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center gap-4 bg-white shadow-sm border border-gray-100 px-3 py-2 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      className="h-full w-full object-cover"
                      src={user.avatar}
                      alt={user.name}
                    />
                  </div>
                  <div>
                    <Link
                      to={`/user/${user._id}`}
                      className="font-medium text-base hover:text-primary transition-colors line-clamp-1"
                    >
                      {user.name}
                    </Link>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <IoMdPeople className="text-sm" />
                      {user.followerCount} followers
                    </div>
                  </div>
                </div>
                
                <button
                  disabled={followLoading[user._id]}
                  onClick={() => followUserHandler(user._id)}
                  className="text-primary border border-dashed border-blue-500
                        hover:bg-primary hover:text-white
                        rounded-md py-1 px-3 text-sm font-semibold transition duration-300"
                >
                  {followLoading[user._id] ? (
                    <div className="flex items-center gap-2 justify-center">
                      <span className="loader w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                  ) : (
                    <p className="flex items-center gap-2">
                      <BsPersonPlusFill className="text-lg" />
                      Follow
                    </p>
                  )}
                </button>
              </li>
            ))}
        </ul>
      </div>
      
      {/* Footer */}
      <div className="text-xs text-gray-400 mt-6">
        <p>© 2025 SocialEcho. All rights reserved.</p>
        <div className="flex gap-2 mt-1">
          <Link to="/privacy" className="hover:text-gray-600">Privacy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-gray-600">Terms</Link>
          <span>•</span>
          <Link to="/help" className="hover:text-gray-600">Help</Link>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;