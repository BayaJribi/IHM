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
                src="https://source.unsplash.com/random/600x600/?community" 
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
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                    Username
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                      placeholder="Choose a username"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                
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
              
              <div 
                className={`mt-6 mb-6 cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-medium transition-colors ${
                  isConsentGiven && !isModerator 
                    ? "border-green-500 bg-green-50 text-green-600" 
                    : "border-gray-300 hover:border-blue-400"
                }`}
                onClick={() => setIsModalOpen(true)}
              >
                {isConsentGiven && !isModerator 
                  ? "Context-Based Authentication is enabled" 
                  : "Click to enable Context-Based Authentication"}
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
              <a
                href="https://github.com/nz-m/SocialEcho"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-600"
              >
                <AiFillGithub className="mr-2 h-5 w-5" />
                <span>GitHub</span>
              </a>
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