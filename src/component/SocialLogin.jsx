import { useNavigate } from "react-router-dom";
import google from "../assets/Untitled_design__19_-removebg-preview.png";
import { useDispatch } from "react-redux";
import {
  setUser,
  toggleLoading,
  setErrorMessage,
} from "../redux/features/user/userSlice";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useAddUserMutation } from "../redux/features/api/userApi";


const SocialLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signInWithGoogle } = useAuth();
  const [addUser] = useAddUserMutation();

  const handleGoogleLogin = () => {
    dispatch(toggleLoading(true));
    signInWithGoogle()
      .then((result) => {
        const user = result.user;

        // Update Redux store with user data
        dispatch(
          setUser({
            uid: user?.uid,
            name: user?.displayName,
            email: user?.email,
            photoURL: user?.photoURL,
            role: "buyer",
          })
        );

        toast.success("Login successful");

        // User data to be saved
        const userData = {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          photo: user?.photoURL,
          role: "buyer",
        };

        // Save user data to the backend using the addUser API
        addUser(userData)
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            dispatch(setErrorMessage(error.message));
            toast.error("Failed to save user data");
          });
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message));
        toast.error("Login Unsuccessful");
      })
      .finally(() => {
        dispatch(toggleLoading(false));
      });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleGoogleLogin}
        className="w-full py-3 flex items-center justify-center border-2 border-orange-500 text-orange-500 font-semibold rounded-lg shadow-md hover:bg-orange-500 hover:text-white transition-all"
      >
        <img src={google} alt="Google logo" className="w-8 h-8 mr-2" />
        Continue with Google
      </button>
    </div>
  );
};

export default SocialLogin;
