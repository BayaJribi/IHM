import { memo, useMemo, useEffect, useState, useCallback } from "react";
import { getPostsAction, clearPostsAction } from "../../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import Post from "../post/Post";
import CommonLoading from "../loader/CommonLoading";
import Home from "../../assets/home.jpg";
import { HiOutlineRefresh } from "react-icons/hi";
import CurrentTime from "../shared/CurrentTime";

const MemoizedPost = memo(Post);

const LoadMoreButton = ({ onClick, isLoading, postsCount, totalPosts }) => (
  <button
    className="bg-primary hover:bg-blue-700 text-sm text-white font-semibold rounded-lg w-full p-3 my-4 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </>
    ) : (
      <>
        Load More Posts ({postsCount} of {totalPosts})
      </>
    )}
  </button>
);

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const posts = useSelector((state) => state.posts?.posts || []);
  const totalPosts = useSelector((state) => state.posts?.totalPosts || 0);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const LIMIT = 10;

  const fetchPosts = useCallback(async (limit = LIMIT, skip = 0, refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (skip === 0) {
      setIsLoading(true);
    } else {
      setIsLoadMoreLoading(true);
    }

    try {
      await dispatch(getPostsAction(limit, skip));
      setLastRefreshed(new Date());
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
      setIsLoadMoreLoading(false);
    }
  }, [dispatch, LIMIT]);

  useEffect(() => {
    if (userData) {
      fetchPosts(LIMIT, 0);
    }

    return () => {
      dispatch(clearPostsAction());
    };
  }, [userData, dispatch, LIMIT, fetchPosts]);

  const handleLoadMore = useCallback(() => {
    fetchPosts(LIMIT, posts.length);
  }, [fetchPosts, LIMIT, posts.length]);

  const handleRefresh = useCallback(() => {
    dispatch(clearPostsAction());
    fetchPosts(LIMIT, 0, true);
  }, [dispatch, fetchPosts, LIMIT]);

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />);
  }, [posts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="space-y-4">
   

      {/* Posts counter */}
      {posts.length > 0 && (
        <div className="text-sm text-gray-500 mb-4">
          Showing {posts.length} of {totalPosts} posts
        </div>
      )}

      {/* Posts list with gap between posts */}
      <div className="space-y-6">{memoizedPosts}</div>

      {/* Load more button */}
      {posts.length > 0 && posts.length < totalPosts && (
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoadMoreLoading}
          postsCount={posts.length}
          totalPosts={totalPosts}
        />
      )}
   {/* Posts header with refresh button */}
   <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">End of Your Feed</h2>
          <div className="text-xs text-gray-500">
            <CurrentTime />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Refresh posts"
          >
            <HiOutlineRefresh className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Refreshing indicator */}
      {isRefreshing && (
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-4 flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Refreshing your feed...
        </div>
      )}
      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center bg-white rounded-lg shadow-sm p-6 mt-4">
          <div className="py-6 flex justify-center items-center flex-col">
            <img 
              loading="lazy" 
              src={Home} 
              alt="No posts" 
              className="w-64 h-auto object-contain mb-6 rounded-lg opacity-80" 
            />
            <h3 className="font-semibold text-lg text-gray-700 mb-2">
              Your feed is empty
            </h3>
            <p className="text-gray-500 mb-4">
              Join communities or follow users to see posts in your feed.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleRefresh} 
                className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Refresh
              </button>
              <button 
                onClick={() => window.location.href = '/communities'} 
                className="border border-primary text-primary hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Browse Communities
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSection;