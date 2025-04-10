import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import MainSection from "../components/home/MainSection";
import { MdArrowUpward } from "react-icons/md";
import PostForm from "../components/form/PostForm";

const Home = () => {
  const userData = useSelector((state) => state.auth?.userData);
  const communities = useSelector((state) => state.community?.joinedCommunities);
  const [showButton, setShowButton] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const communitySelectRef = useRef(null);

  // Scroll detection for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-focus community select when form is expanded
  useEffect(() => {
    if (isFormExpanded && communitySelectRef.current) {
      communitySelectRef.current.focus();
    }
  }, [isFormExpanded]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCommunityChange = (e) => {
    setSelectedCommunity(e.target.value);
    // Auto-expand form when community is selected
    if (e.target.value && !isFormExpanded) {
      setIsFormExpanded(true);
    }
  };

  const toggleFormExpansion = () => {
    setIsFormExpanded(!isFormExpanded);
    // Reset selection if collapsing
    if (isFormExpanded) {
      setSelectedCommunity("");
    }
  };

  return (
    <div className="main-section">
      {/* Add New Post Section */}
      <section aria-labelledby="post-form-heading" className="mt-6 bg-white rounded-lg shadow-sm p-4 mb-6">
        <button
          onClick={toggleFormExpansion}
          aria-expanded={isFormExpanded}
          aria-controls="post-form-content"
          className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          <h2 id="post-form-heading" className="font-bold text-lg">
            {isFormExpanded ? "POST LATER" : "what are you thinking about now?"}
          </h2>
          <span className="transform transition-transform duration-200">
            {isFormExpanded ? "−" : "+"}
          </span>
        </button>

        <div 
          id="post-form-content"
          className={`transition-all duration-300 overflow-hidden ${isFormExpanded ? "max-h-screen mt-4" : "max-h-0"}`}
        >
          {/* Community Selection */}
          <div className="mb-4">
            <label 
              htmlFor="community-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
            </label>
            <select
              id="community-select"
              ref={communitySelectRef}
              value={selectedCommunity}
              onChange={handleCommunityChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              aria-required="true"
              aria-invalid={!selectedCommunity && isFormExpanded}
            >
              <option value="" disabled>
                {communities?.length ? "Select a community to post in" : "No communities available"}
              </option>
              {communities?.map((community) => (
                <option 
                  key={community._id} 
                  value={community._id}
                  aria-label={`Community: ${community.name}`}
                >
                  {community.name}
                </option>
              ))}
            </select>
            {!selectedCommunity && isFormExpanded && (
              <p 
                role="alert"
                className="mt-1 text-sm text-red-600"
                aria-live="polite"
              >
                Please select a community to continue
              </p>
            )}
          </div>

          {/* Post Form (only when community is selected) */}
          {selectedCommunity && (
            <PostForm 
              communityId={selectedCommunity}
              communityName={communities.find(c => c._id === selectedCommunity)?.name}
              onSuccess={() => {
                setSelectedCommunity("");
                setIsFormExpanded(false);
              }}
            />
          )}
        </div>
      </section>

      {/* Main Content Section */}
      <MainSection userData={userData} />

      {/* Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
          showButton ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ transition: "opacity 0.3s ease" }}
      >
        <MdArrowUpward size={24} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Home;