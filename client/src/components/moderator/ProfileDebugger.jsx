import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getModProfileAction } from "../../redux/actions/authActions";
import { getUserAction } from "../../redux/actions/userActions";

const ProfileDebugger = ({ userId }) => {
  const dispatch = useDispatch();
  const [modLoading, setModLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [reduxState, setReduxState] = useState({});
  
  // Get full Redux state for debugging
  const entireState = useSelector(state => state);
  const modProfile = useSelector(state => state.moderation?.modProfile);
  const userData = useSelector(state => state.user?.user);
  
  useEffect(() => {
    // Log the entire Redux state for debugging
    console.log("Full Redux State:", entireState);
    setReduxState(entireState);
  }, [entireState]);
  
  const testModProfile = async () => {
    setModLoading(true);
    try {
      console.log("Testing Mod Profile Action...");
      const result = await dispatch(getModProfileAction());
      console.log("Mod Profile Action Result:", result);
    } catch (error) {
      console.error("Mod Profile Error:", error);
    } finally {
      setModLoading(false);
    }
  };
  
  const testUserProfile = async () => {
    if (!userId) {
      console.error("No user ID provided");
      return;
    }
    
    setUserLoading(true);
    try {
      console.log(`Testing User Action with ID: ${userId}`);
      const result = await dispatch(getUserAction(userId));
      console.log("User Action Result:", result);
    } catch (error) {
      console.error("User Profile Error:", error);
    } finally {
      setUserLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Profile Debugger</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Redux State Structure</h3>
        <div className="bg-white p-3 rounded overflow-auto max-h-64">
          <pre className="text-xs">{JSON.stringify(reduxState, null, 2)}</pre>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-3">Moderator Profile Test</h3>
          <div className="mb-3">
            <p className="text-sm">Current Value:</p>
            <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(modProfile, null, 2)}</pre>
          </div>
          <button 
            onClick={testModProfile}
            disabled={modLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {modLoading ? "Testing..." : "Test Mod Profile Action"}
          </button>
        </div>
        
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-3">User Profile Test</h3>
          <div className="mb-3">
            <p className="text-sm">Current Value:</p>
            <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(userData, null, 2)}</pre>
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1">User ID to Test:</label>
            <input 
              type="text" 
              value={userId || ''} 
              readOnly
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <button 
            onClick={testUserProfile}
            disabled={userLoading || !userId}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {userLoading ? "Testing..." : "Test User Profile Action"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDebugger;