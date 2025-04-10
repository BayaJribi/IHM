import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInAction } from "../redux/actions/adminActions";
import { AiFillGithub } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { IoIosArrowRoundBack } from "react-icons/io";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import Logo from "../assets/SocialEcho.png";

const AdminSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Signing in...");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setShowError(true);
    const data = {
      username: username,
      password: password,
    };
    
    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);
    
    await dispatch(signInAction(data)).then(() => {
      setLoading(false);
      navigate("/admin");
    }).catch(() => {
      setLoading(false);
    });
    
    clearTimeout(timeout);
  };

  const signInError = useSelector((state) => state.admin?.signInError);

  const handleClearMessage = () => {
    // Since clearMessage action isn't available, we'll use local state to hide the error
    setShowError(false);
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
        <div className="flex w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
          {/* Left side - Admin illustration */}
          <div className="hidden w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 md:block">
            <div className="flex h-full w-full flex-col items-center justify-center p-8">
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white/20 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="text-center text-white">
                <h2 className="mb-4 text-3xl font-bold">Admin Portal</h2>
                <p className="text-lg">Access the administrative dashboard to manage SocialEcho platform</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Admin Form */}
          <div className="w-full bg-white p-8 md:w-1/2">
            <div className="mx-auto mb-6 flex justify-center">
              <img className="h-10 w-auto" src={Logo} alt="SocialEcho Logo" />
            </div>
            
            <h2 className="mb-6 text-center text-xl font-semibold text-gray-700">
              Administrator Sign In
            </h2>
            
            {signInError && showError && (
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

            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
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
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
                    placeholder="Enter admin username"
                    required
                    autoComplete="username"
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
                    className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
                    placeholder="Enter admin password"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full transform rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
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

            <div className="mt-8 flex items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <IoIosArrowRoundBack className="mr-2 h-5 w-5" />
                <span>Back to home</span>
              </Link>
              
              <a
                href="https://github.com/nz-m/SocialEcho"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
              >
                <AiFillGithub className="mr-2 h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminSignIn;