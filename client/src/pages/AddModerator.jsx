import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpAction, clearMessage } from "../redux/actions/authActions";
import { RxCross1 } from "react-icons/rx";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import Logo from "../assets/SocialEcho.png";
import { useNavigate } from "react-router-dom";

const AddModerator = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

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

      // Set success message
      setSuccessMessage("Moderator account created successfully!");

      // After a brief pause, navigate to /admin page
      setTimeout(() => {
        navigate("/admin");
      }, 2000); // Delay navigation to show success message

    } catch (error) {
      console.error("Error creating moderator:", error);
    }

    setLoading(false);
    clearTimeout(timeout);
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mx-auto flex justify-center">
            <img className="h-8 w-auto" src={Logo} alt="Logo" />
          </div>

          {signUpError &&
            Array.isArray(signUpError) &&
            signUpError.map((err, i) => (
              <div
                className="mt-6 flex items-center rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                role="alert"
                key={i}
              >
                <span className="ml-2 block sm:inline">{err}</span>
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
              className="mt-6 flex items-center rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
              role="alert"
            >
              <span className="ml-2 block sm:inline">{successMessage}</span>
            </div>
          )}

          <input
            type="text"
            placeholder="Moderator name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-6 w-full rounded-lg border px-4 py-3 text-gray-700"
            required
          />

          <input
            type="email"
            placeholder="Moderator email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-4 w-full rounded-lg border px-4 py-3 text-gray-700"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-lg border px-4 py-3 text-gray-700"
            required
          />

          <label className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-3 text-center text-gray-400">
            <span>Upload Avatar</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>

          {avatar && (
            <div className="mt-2 text-sm text-blue-500">{avatar.name}</div>
          )}
          {avatarError && (
            <div className="mt-2 text-sm text-red-500">{avatarError}</div>
          )}

          <button
            disabled={loading}
            type="submit"
            className={`mt-6 w-full rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-700 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {loading ? (
              <ButtonLoadingSpinner loadingText={loadingText} />
            ) : (
              "Create Moderator"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddModerator;
