import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import MainSection from "../components/home/MainSection";
import { MdArrowUpward } from "react-icons/md"; // Import the arrow icon
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import PostForm from "../components/form/PostForm"; // Import PostForm

const Home = () => {
  const userData = useSelector((state) => state.auth?.userData); // Utilisateur connecté
  const communities = useSelector((state) => state.community?.joinedCommunities); // Liste des communautés de l'utilisateur

  const [showButton, setShowButton] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(""); // État pour la communauté sélectionnée

  useEffect(() => {
    // Écouter les événements de défilement pour afficher/masquer le bouton
    const handleScroll = () => {
      if (window.scrollY > 200) { // Afficher le bouton après 200px de défilement
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Vérifier si l'utilisateur a sélectionné une communauté
  const isCommunitySelected = selectedCommunity !== "";

  return (
    <div className="main-section">
       {/* Add New Post Form */}
       <div className="mt-6">
        <h2 className="text-center font-bold text-xl mb-4">Add a New Post</h2>

        {/* Dropdown to select community */}
        <div className="mb-4">
          <label htmlFor="community" className="block text-lg mb-2">
            Choose a Community:
          </label>
          <select
            id="community"
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="" disabled>
              Select a community
            </option>
            {communities?.map((community) => (
              <option key={community._id} value={community._id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        {/* Show the post form only if a community is selected */}
        {isCommunitySelected ? (
          <PostForm 
            communityId={selectedCommunity} // Pass the selected community ID
            communityName={communities.find(c => c._id === selectedCommunity)?.name} // Get the selected community name
          />
        ) : (
          <p className="text-center text-red-500">Please select a community to post.</p>
        )}
      </div>
      <MainSection userData={userData} />
      
      

     

      {/* Scroll-to-Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300"
        >
          <MdArrowUpward size={24} />
        </button>
      )}
    </div>
  );
};

export default Home;
