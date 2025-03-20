import { useNavigate } from "react-router-dom";
import google from "../assets/Untitled_design__19_-removebg-preview.png";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
const SocialLogin = () => {
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { signInWithGoogle, setUser } = useAuth();

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success(" Login successful");

        const userData = {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          photo: user?.photoURL,
        };

        axiosPublic.post("/users", userData);

        navigate("/");
      })
      .catch(() => {
        toast.error(" Login Unsuccessful");
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
