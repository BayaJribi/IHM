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
      <section className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 transition-all duration-300">
        <button
          onClick={toggleFormExpansion}
          aria-expanded={isFormExpanded}
          aria-controls="post-form-content"
          className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {isFormExpanded ? "Collapse" : "What's on your mind?"}
          </h2>
          <span className="text-2xl font-bold text-primary dark:text-primary-light">
            {isFormExpanded ? "−" : "+"}
          </span>
        </button>

        <div
          id="post-form-content"
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isFormExpanded ? "max-h-[1000px] mt-6" : "max-h-0"}`}
        >
          <div className="mb-4">
            <label htmlFor="community-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose a community
            </label>
            <select
              id="community-select"
              ref={communitySelectRef}
              value={selectedCommunity}
              onChange={handleCommunityChange}
              className="block w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
              aria-required="true"
              aria-invalid={!selectedCommunity && isFormExpanded}
            >
              <option value="" disabled>
                {communities?.length ? "Select a community to post in" : "No communities available"}
              </option>
              {communities?.map((community) => (
                <option key={community._id} value={community._id}>
                  {community.name}
                </option>
              ))}
            </select>
            {!selectedCommunity && isFormExpanded && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                Please select a community to continue.
              </p>
            )}
          </div>

          {selectedCommunity && (
            <PostForm
              communityId={selectedCommunity}
              communityName={communities.find((c) => c._id === selectedCommunity)?.name}
              onSuccess={() => {
                setSelectedCommunity("");
                setIsFormExpanded(false);
              }}
            />
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
