import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpAction, clearMessage } from "../redux/actions/authActions";
import { RxCross1 } from "react-icons/rx";
import { FiArrowLeft } from "react-icons/fi"; // Added arrow icon
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import { useNavigate } from "react-router-dom";

const AddModerator = ({ onBack }) => { // Added onBack prop
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const signUpError = useSelector((state) => state.auth?.signUpError);
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAvatar(null);
      setAvatarError(null);
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      setAvatar(null);
      setAvatarError("Please upload a valid image file (jpeg, jpg, png)");
    } else if (file.size > 10 * 1024 * 1024) {
      setAvatar(null);
      setAvatarError("Please upload an image file less than 10MB");
    } else {
      setAvatar(file);
      setAvatarError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Creating moderator account...");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("role", "moderator");
    formData.append("isConsentGiven", "true");

    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);

    try {
      await dispatch(signUpAction(formData));
      setSuccessMessage("Moderator account created successfully!");
      setTimeout(() => {
        if (onBack) {
          onBack(); // Use the callback if provided
        } else {
          navigate("/admin"); // Fallback to navigation
        }
      }, 2000);
    } catch (error) {
      console.error("Error creating moderator:", error);
    }

    setLoading(false);
    clearTimeout(timeout);
  };

  return (
    <section className="bg-gray-50 py-6">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center">
            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4 transition-colors"
              title="Back to moderators list"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Add New Moderator</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {signUpError &&
              Array.isArray(signUpError) &&
              signUpError.map((err, i) => (
                <div
                  className="flex items-center rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700"
                  role="alert"
                  key={i}
                >
                  <span className="block text-sm">{err}</span>
                  <button
                    className="ml-auto font-bold text-red-700"
                    onClick={() => dispatch(clearMessage())}
                  >
                    <RxCross1 className="h-3 w-3" />
                  </button>
                </div>
              ))}

            {successMessage && (
              <div
                className="flex items-center rounded border border-green-400 bg-green-50 px-4 py-3 text-green-700"
                role="alert"
              >
                <span className="block text-sm">{successMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  Moderator Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Set a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Profile Picture (Optional)
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 transition-colors hover:border-blue-400 hover:bg-blue-50">
                  <span className="text-sm text-gray-500">
                    {avatar ? avatar.name : "Click to upload or drag and drop"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
                {avatarError && (
                  <p className="mt-1 text-sm text-red-500">{avatarError}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              
              <button
                disabled={loading}
                type="submit"
                className={`flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
              >
                {loading ? (
                  <ButtonLoadingSpinner loadingText={loadingText} />
                ) : (
                  "Create Moderator Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddModerator;