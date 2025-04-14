import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getModProfileAction } from "../../redux/actions/authActions";
import CommonLoading from "../loader/CommonLoading";

const ModeratorProfile = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Get both the profile and any error message from the Redux store
  const moderator = useSelector((state) => state.moderation?.modProfile);
  const modError = useSelector((state) => state.moderation?.modError);
  
  // Use userData from auth state as a fallback
  const userData = useSelector((state) => state.auth?.userData);

  useEffect(() => {
    const fetchModeratorProfile = async () => {
      try {
        setIsLoading(true);
        await dispatch(getModProfileAction());
      } catch (error) {
        console.error("Error fetching moderator profile:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModeratorProfile();
  }, [dispatch]);

  // Display detailed debugging info if there's an error
  const renderErrorDetails = () => (
    <div className="text-sm text-gray-500 mt-2">
    </div>
  );

  // If we're still loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <CommonLoading />
      </div>
    );
  }

  // Error handling - but use userData as fallback if available
  if ((hasError || !moderator) && !userData) {
    return (
      <div className="flex justify-center items-center flex-col h-60 p-4">
        <div className="text-red-500 text-xl">Failed to load profile</div>
        <p className="text-gray-600 mt-2">
          {modError || "Server error occurred. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
        {renderErrorDetails()}
      </div>
    );
  }

  // Use userData as fallback if moderator profile is not available
  const profileData = moderator || userData;

  return (
    <div className="flex flex-col gap-2 items-center p-4">
      {/* Show a warning if using fallback data */}
      {!moderator && userData && (
        <div className="w-full mb-2 p-2 bg-white-100 text-yellow-800 rounded text-sm">
        </div>
      )}
      
      {profileData?.avatar && (
        <img
          src={profileData.avatar}
          alt="user"
          className="w-20 h-20 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      )}
      <p>
        <span className="font-bold">{profileData?.name || "Unknown User"}</span>
      </p>
      <p>{profileData?.email || "No email available"}</p>
      {profileData?.createdAt && (
        <p>Joined: {new Date(profileData.createdAt).toLocaleDateString()}</p>
      )}
      {profileData?.role && <p>Role: {profileData.role}</p>}
    </div>
  );
};

export default ModeratorProfile;