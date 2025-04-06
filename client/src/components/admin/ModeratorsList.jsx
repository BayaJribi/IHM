import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getModeratorsAction,
  deleteModeratorAction, // 🔥 NEW ACTION
} from "../../redux/actions/adminActions";

const ModeratorsList = () => {
  const dispatch = useDispatch();
  const moderators = useSelector((state) => state.admin?.moderators);

  useEffect(() => {
    dispatch(getModeratorsAction());
  }, [dispatch]);

  const handleDeleteModerator = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this moderator?")) {
      dispatch(deleteModeratorAction(id));
    }
  };

  if (!moderators) {
    return <div>Loading moderators...</div>;
  }

  return (
    <div className="flex flex-col h-[85vh] w-full mt-3 border rounded-md">
      <div className="bg-white shadow-inner rounded-md p-4">
        <h1 className="text-xl font-bold pb-4 text-center border-b-2 mb-4">
          Moderators List
        </h1>

        <div className="overflow-y-auto">
          {moderators.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No moderators found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moderators.map((moderator) => (
                <div
                  key={moderator._id}
                  className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                      {moderator.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-lg">{moderator.name}</span>
                      <span className="text-sm text-gray-500">{moderator.email || "No email provided"}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t text-sm">
                    <div className="flex justify-between">
                      <span>User ID:</span>
                      <span className="text-gray-600">{moderator._id}</span>
                    </div>
                    {moderator.joinDate && (
                      <div className="flex justify-between mt-1">
                        <span>Joined:</span>
                        <span className="text-gray-600">
                          {new Date(moderator.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteModerator(moderator._id)}
                    className="mt-4 w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete Moderator
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorsList;
