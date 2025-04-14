import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signUpAction, clearMessage } from "../redux/actions/authActions";
import { Link } from "react-router-dom";
import ContextAuthModal from "../components/modals/ContextAuthModal";
import { RxCross1 } from "react-icons/rx";
import { AiFillGithub } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import Logo from "../assets/SocialEcho.png";

const SignUpNew = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUpError = useSelector((state) => state.auth?.signUpError);

  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (e.target.value.includes("mod.socialecho.com")) {
      setIsModerator(true);
    } else {
      setIsModerator(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAvatar(null);
      setAvatarPreview(null);
      setAvatarError(null);
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      setAvatar(null);
      setAvatarPreview(null);
      setAvatarError("Please upload a valid image file (jpeg, jpg, png)");
    } else if (file.size > 10 * 1024 * 1024) {
      setAvatar(null);
      setAvatarPreview(null);
      setAvatarError("Please upload an image file less than 10MB");
    } else {
      setAvatar(file);
      setAvatarError(null);
      
      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification si l'email contient "mod.socialecho.com"
    if (email.includes("mod.socialecho.com")) {
      alert("You can't sign up as a moderator. Please contact us.");
      return; // Annule l'inscription
    }

    setLoading(true);
    setLoadingText("Signing up...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("role", "general");
    formData.append("isConsentGiven", isConsentGiven.toString());

    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);

    await dispatch(signUpAction(formData, navigate, isConsentGiven, email));
    setLoading(false);
    setIsConsentGiven(false);
    clearTimeout(timeout);
  };

  const handleClearError = () => {
    dispatch(clearMessage());
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
        <div className="flex w-full max-w-6xl overflow-hidden rounded-lg shadow-lg">
          {/* Left side - Gradient Background with Image */}
          <div className="hidden w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 md:block">
            <div className="flex h-full w-full flex-col items-center justify-center p-8">
              <img 
                src="data:image/jpeg;base64,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" 
                alt="SocialEcho community" 
                className="mb-6 h-64 w-64 rounded-full object-cover shadow-lg"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/api/placeholder/600/600";
                }}
              />
              <div className="text-center text-white">
                <h2 className="mb-4 text-3xl font-bold">Join SocialEcho</h2>
                <p className="text-lg">Share your thoughts anonymously and connect with like-minded people</p>
                <p className="mt-6 text-base">
                  Our platform provides a safe space for authentic expression, fostering meaningful connections through shared interests and experiences.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="w-full bg-white p-8 md:w-1/2">
            <div className="mx-auto mb-6 flex justify-center">
              <img className="h-12 w-auto" src={Logo} alt="SocialEcho Logo" />
            </div>
            
            {signUpError &&
              Array.isArray(signUpError) &&
              signUpError.map((err, i) => (
                <div
                  className="mb-6 flex items-center justify-between rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                  role="alert"
                  key={i}
                >
                  <div>
                    <span className="block sm:inline">{err}</span>
                  </div>
                  <button
                    className="font-bold text-red-700"
                    onClick={handleClearError}
                    aria-label="Close error message"
                  >
                    <RxCross1 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            
            <div className="mb-6 flex items-center justify-center">
              <Link
                to={"/signin"}
                className="w-1/3 border-b border-gray-400 pb-4 text-center font-medium text-gray-500 transition-colors hover:text-gray-700"
              >
                Sign In
              </Link>
              <Link
                to={"/signup"}
                className="w-1/3 border-b-2 border-blue-500 pb-4 text-center font-medium text-gray-800"
                aria-current="page"
              >
                Sign Up
              </Link>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
                
                <div className="relative">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <input
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      type="email"
                      className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                      placeholder="Enter your email"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                      placeholder="Create a password"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="avatar" className="mb-2 block text-sm font-medium text-gray-700">
                    Profile Photo
                  </label>
                  <div className="flex items-center">
                    {avatarPreview ? (
                      <div className="relative mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                        <img 
                          src={avatarPreview} 
                          alt="Profile preview" 
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar(null);
                            setAvatarPreview(null);
                          }}
                          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ) : null}
                    <label
                      htmlFor="avatar"
                      className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-2 text-center transition-colors hover:border-blue-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        <p className="mt-1 text-sm text-gray-500">
                          {avatar ? "Change photo" : "Upload photo"}
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, PNG (max 10MB)
                        </p>
                      </div>
                      <input
                        id="avatar"
                        type="file"
                        className="hidden"
                        name="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        autoComplete="off"
                      />
                    </label>
                  </div>
                  {avatarError && (
                    <p className="mt-2 text-sm text-red-600">
                      {avatarError}
                    </p>
                  )}
                </div>
              </div>
              
              
              
              <button
                disabled={loading}
                type="submit"
                className={`w-full transform rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  loading ? "cursor-not-allowed opacity-75" : ""
                }`}
              >
                {loading ? (
                  <ButtonLoadingSpinner loadingText={loadingText} />
                ) : (
                  "Create Account"
                )}
              </button>
              
              <div className="mt-6">
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-800">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-600">
             
              <Link
                to="/admin"
                className="flex items-center hover:text-blue-600"
              >
                <MdOutlineAdminPanelSettings className="mr-2 h-5 w-5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal component */}
      <ContextAuthModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsConsentGiven={setIsConsentGiven}
        isModerator={isModerator}
      />
    </section>
  );
};

export default SignUpNew;