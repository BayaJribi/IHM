import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getModProfileAction } from "../../redux/actions/authActions";
import CommonLoading from "../loader/CommonLoading";

const ModeratorProfile = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  const moderator = useSelector((state) => state.moderation?.modProfile);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <CommonLoading />
      </div>
    );
  }
  
  if (hasError || !moderator) {
    return (
      <div className="flex justify-center items-center flex-col h-60 p-4">
        <div className="text-red-500 text-xl">Failed to load profile</div>
        <p className="text-gray-600 mt-2">Server error occurred. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center p-4">
      {moderator.avatar && (
        <img
          src={moderator.avatar}
          alt="user"
          className="w-20 h-20 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      )}
      <p>
        <span className="font-bold">{moderator.name}</span>
      </p>
      <p>{moderator.email}</p>
      <p>Joined: {new Date(moderator.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ModeratorProfile;