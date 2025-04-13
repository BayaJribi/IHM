import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInAction, clearMessage } from "../redux/actions/authActions";
import { AiFillGithub } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import Logo from "../assets/SocialEcho.png";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoadingText("Signing in...");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("rememberMe", rememberMe);
    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);
    await dispatch(signInAction(formData, navigate));
    setLoading(false);
    clearTimeout(timeout);
  };

  const signInError = useSelector((state) => state.auth?.signInError);
  const successMessage = useSelector((state) => state.auth?.successMessage);

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
        <div className="flex w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
          {/* Left side - Illustration */}
          <div className="hidden w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 md:block">
            <div className="flex h-full w-full flex-col items-center justify-center p-8">
              {/* Using a placeholder since we can't directly reference external images */}
              <img 
                src="C:\Users\Lenovo\Pictures\1723242158 - Copie.jpg" 
                alt="pic" 
                className="mb-6 h-48 w-48 rounded-full object-cover shadow-lg"
              />
              <div className="text-center text-white">
                <h2 className="mb-4 text-3xl font-bold">SocialEcho</h2>
                <p className="text-lg">Share your thoughts anonymously and connect with your community</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="w-full bg-white p-8 md:w-1/2">
            <div className="mx-auto mb-6 flex justify-center">
              <img className="h-10 w-auto" src={Logo} alt="SocialEcho Logo" />
            </div>
            
            {signInError && (
              <div
                className="mb-6 flex items-center justify-between rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                role="alert"
              >
                <div>
                  <span className="block sm:inline">{signInError}</span>
                </div>
                <button
                  className="font-bold text-red-700"
                  onClick={handleClearMessage}
                  aria-label="Close error message"
                >
                  <RxCross1 className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {successMessage && (
              <div
                className="mb-6 flex items-center justify-between rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                role="alert"
              >
                <div>
                  <span className="block sm:inline">{successMessage}</span>
                </div>
                <button
                  className="font-bold text-green-700"
                  onClick={handleClearMessage}
                  aria-label="Close success message"
                >
                  <RxCross1 className="h-3 w-3" />
                </button>
              </div>
            )}
            
            <div className="mb-6 flex items-center justify-center">
              <Link
                to={"/signin"}
                className="w-1/3 border-b-2 border-blue-500 pb-4 text-center font-medium text-gray-800"
                aria-current="page"
              >
                Sign In
              </Link>
              <Link
                to={"/signup"}
                className="w-1/3 border-b border-gray-400 pb-4 text-center font-medium text-gray-500 transition-colors hover:text-gray-700"
              >
                Sign Up
              </Link>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
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
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div className="relative mb-6">
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
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full transform rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  loading ? "cursor-not-allowed opacity-75" : ""
                }`}
              >
                {loading ? (
                  <ButtonLoadingSpinner loadingText={loadingText} />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-800">
                  Sign up
                </Link>
              </p>
            </div>

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
    </section>
  );
};

export default SignIn;