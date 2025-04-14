import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAction } from "../../redux/actions/userActions";
import PostOnProfile from "../post/PostOnProfile";
import OwnProfileCard from "./OwnProfileCard";
import CommonLoading from "../loader/CommonLoading";
import OwnInfoCard from "./OwnInfoCard";
import NoPost from "../../assets/nopost.jpg";

const UserProfile = ({ userData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user data from both sources
  const user = useSelector((state) => state.user?.user);
  const authUserData = useSelector((state) => state.auth?.userData);
  
  // Debug logs
  console.log("UserProfile component rendered");
  console.log("userData prop:", userData);
  console.log("user from Redux state:", user);
  console.log("authUserData from Redux state:", authUserData);
  
  const posts = user?.posts || [];

  useEffect(() => {
    if (!userData || !userData._id) {
      console.warn("UserProfile: userData or userData._id is missing");
      setError("User data is missing");
      setLoading(false);
      return;
    }

    console.log(`Fetching user with ID: ${userData._id}`);
    setLoading(true);
    
    const fetchUser = async () => {
      try {
        const result = await dispatch(getUserAction(userData._id));
        console.log("getUserAction result:", result);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, userData]);

  const MemoizedPostOnProfile = memo(PostOnProfile);

  // Use a merged user object that combines data from both sources if needed
  const mergedUser = {
    ...authUserData,
    ...user,
  };
  
  // If there's an error, show the error message
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  // If loading is true or user is not available yet, show loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoading />
      </div>
    );
  }

  // Show debug info about the available user data
  const showDebugInfo = () => (
    <div className="bg-gray-100 p-3 rounded-lg mb-4 text-xs">
      <h4 className="font-bold mb-1">Debug Info</h4>
      <p>User data available from Redux: {Object.keys(user || {}).length > 0 ? "Yes" : "No"}</p>
      <p>Auth user data available: {Object.keys(authUserData || {}).length > 0 ? "Yes" : "No"}</p>
      <p>User ID from props: {userData?._id || "Not provided"}</p>
      <p>Available user properties: {Object.keys(mergedUser || {}).join(", ")}</p>
    </div>
  );

  return (
    <>
      {showDebugInfo()}
      <OwnProfileCard user={mergedUser} />
      <OwnInfoCard user={mergedUser} />

      <h3 className="font-semibold text-center mb-4 text-gray-700 p-3 border-b">
        Your most recent posts
      </h3>

      {posts.length === 0 ? (
        <div className="text-center text-gray-700 flex justify-center items-center flex-col">
          <p className="font-semibold py-5 text-gray-500">
            You haven't posted anything yet
          </p>
          <img
            className="max-w-md rounded-full"
            src={NoPost}
            alt="no post"
          />
        </div>
      ) : (
        posts.map((post) => (
          <MemoizedPostOnProfile key={post._id} post={post} />
        ))
      )}
    </>
  );
};

export default UserProfile;