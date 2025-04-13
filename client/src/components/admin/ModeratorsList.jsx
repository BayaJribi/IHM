import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getModeratorsAction,
  deleteModeratorAction,
} from "../../redux/actions/adminActions";
import { FiUser, FiTrash2, FiPlus, FiSearch } from "react-icons/fi"; // Added FiSearch
import { FaUserShield } from "react-icons/fa";
import AddModerator from "../../pages/AddModerator";

const ModeratorsList = () => {
  const dispatch = useDispatch();
  const moderators = useSelector((state) => state.admin?.moderators);
  const [activeTab, setActiveTab] = useState("moderatorslist");
  const [searchTerm, setSearchTerm] = useState(""); // Added search state

  useEffect(() => {
    dispatch(getModeratorsAction());
  }, [dispatch]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDeleteModerator = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete moderator "${name}"?`)) {
      dispatch(deleteModeratorAction(id));
    }
  };

  // Handler to go back to moderators list
  const handleBackToList = () => {
    setActiveTab("moderatorslist");
  };

  // Search functionality
  const filteredModerators = moderators
    ? moderators.filter(
        (moderator) =>
          moderator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (moderator.email && moderator.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  if (!moderators && activeTab === "moderatorslist") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Content */}
      {activeTab === "moderatorsadd" && <AddModerator onBack={handleBackToList} />}

      {activeTab === "moderatorslist" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-4">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Moderators Management
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredModerators.length} of {moderators.length} {moderators.length === 1 ? "moderator" : "moderators"} {searchTerm && "matched"}
              </p>
            </div>
            <button 
              onClick={() => handleTabClick("moderatorsadd")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add New Moderator
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search moderators by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <span className="sr-only">Clear search</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 250px)" }}>
            {filteredModerators.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                {searchTerm ? (
                  <>
                    <FiSearch className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
                    <p className="text-gray-500 mt-1">
                      No moderators match your search "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <FiUser className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No moderators found</h3>
                    <p className="text-gray-500 mt-1">
                      There are currently no moderators registered in the system
                    </p>
                  </>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredModerators.map((moderator) => (
                  <li key={moderator._id} className="hover:bg-gray-50">
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-lg font-semibold text-blue-600 flex-shrink-0">
                        {moderator.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-gray-900">
                            {moderator.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {moderator.email || "No email provided"}
                          </p>
                          
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <div className="text-sm text-gray-500">User ID:</div>
                          <div className="text-xs font-mono text-gray-700 truncate max-w-xs">
                            {moderator._id}
                          </div>
                          {moderator.joinDate && (
                            <div className="text-sm text-gray-500 mt-1">
                              Joined: {new Date(moderator.joinDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorsList;