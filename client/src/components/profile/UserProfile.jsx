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
  const user = useSelector((state) => state.user?.user);
  const posts = user?.posts || [];

  useEffect(() => {
    if (!userData || !userData._id) {
      setError("User data is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchUser = async () => {
      try {
        await dispatch(getUserAction(userData._id));
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

  // If there's an error, show the error message
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  // If loading is true or user is not available yet, show loading
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoading />
      </div>
    );
  }

  return (
    <>
      <OwnProfileCard user={user} />
      <OwnInfoCard user={user} />

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