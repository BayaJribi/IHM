import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowUpward, MdChatBubbleOutline } from "react-icons/md";
import MainSection from "../components/home/MainSection";
import PostForm from "../components/form/PostForm";

const Home = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth?.userData);
  const communities = useSelector((state) => state.community?.joinedCommunities);
  const [showButton, setShowButton] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const communitySelectRef = useRef(null);

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Autofocus select input when form is open
  useEffect(() => {
    if (isFormExpanded && communitySelectRef.current) {
      communitySelectRef.current.focus();
    }
  }, [isFormExpanded]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCommunityChange = (e) => {
    const value = e.target.value;
    setSelectedCommunity(value);
    if (value && !isFormExpanded) {
      setIsFormExpanded(true);
    }
  };

  const toggleFormExpansion = () => {
    setIsFormExpanded(!isFormExpanded);
    if (isFormExpanded) {
      setSelectedCommunity("");
    }
  };

  const goToChat = () => {
    navigate("/chat");
  };

  return (
    <div className="main-section px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Add Post Section */}
      <section className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-all duration-300 border border-gray-200 dark:border-gray-700">
  <button
    onClick={toggleFormExpansion}
    aria-expanded={isFormExpanded}
    aria-controls="post-form-content"
    className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-primary dark:text-primary-light"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-3a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H7a1 1 0 110-2h3V7z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
        {isFormExpanded ? "Close Editor" : "What's on your mind?"}
      </h2>
    </div>
    <span className={`h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-primary group-hover:text-white transition-all duration-300 ${isFormExpanded ? "rotate-180" : ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  </button>

  <div
    id="post-form-content"
    className={`transition-all duration-500 ease-in-out overflow-hidden ${
      isFormExpanded ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
    }`}
  >
    <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
      <label
        htmlFor="community-select"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-primary dark:text-primary-light"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        Choose a community
      </label>
      
      <div className="relative">
        <select
          id="community-select"
          ref={communitySelectRef}
          value={selectedCommunity}
          onChange={handleCommunityChange}
          className="block w-full p-3 pl-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light text-gray-800 dark:text-gray-200 appearance-none"
          aria-required="true"
          aria-invalid={!selectedCommunity && isFormExpanded}
        >
          <option value="" disabled>
            {communities?.length 
              ? "Select a community to post in" 
              : "No communities available"}
          </option>
          {communities?.map((community) => (
            <option key={community._id} value={community._id}>
              {community.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
          <svg 
            className="h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
      
      {!selectedCommunity && isFormExpanded && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </p>
      )}
    </div>

    {selectedCommunity && (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div className="mb-3 flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Posting in {communities.find((c) => c._id === selectedCommunity)?.name}
          </span>
        </div>
        <PostForm
          communityId={selectedCommunity}
          communityName={communities.find((c) => c._id === selectedCommunity)?.name}
          onSuccess={() => {
            setSelectedCommunity("");
            setIsFormExpanded(false);
          }}
        />
      </div>
    )}
  </div>
</section>
      {/* Main Feed Section */}
      <MainSection userData={userData} />

      {/* Floating Chat Button */}
      {/* Floating Chat Button - Blue Version */}
      <div className="fixed bottom-24 right-6 group">
        <button
          onClick={goToChat}
          aria-label="Go to Chat"
          className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <MdChatBubbleOutline size={26} />
        </button>
        <div className="absolute bottom-14 right-0 bg-gray-800 text-white text-sm rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Open Chat
        </div>
      </div>


      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-xl transition-opacity duration-300 ${showButton ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <MdArrowUpward size={24} />
      </button>
    </div>
  );
};

export default Home;
