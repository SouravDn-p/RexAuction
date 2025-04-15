import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.init";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { toast } from "react-hot-toast"; // ✅ Hot toast
import LoadingSpinner from "../component/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure.jsx";

export const AuthContexts = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [liveBid, setLiveBid] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dbUser, setDbUser] = useState("");
  const [response, setResponse] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [errorMessage, setErrorMessage] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  // get specific user data
  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axiosPublic
        .get(`/user/${user.email}`)
        .then((res) => {
          setDbUser(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setErrorMessage("Failed to load user data");
          setLoading(false);
        });
    }
  }, [user?.email]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Create a new user with email and password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Log in an existing user with email and password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("🎉 Login Successful! Welcome back!"); // ✅ hot-toast message
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in the user with Google using Firebase Authentication
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Log the user out using Firebase Authentication
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update the user's profile information using Firebase Authentication
  const userProfileUpdate = (name, photo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // Sends a password reset email to the provided email address using Firebase Authentication
  const changePassword = (auth, email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset email sent!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // This useEffect hook listens to authentication state changes using Firebase's onAuthStateChanged
  useEffect(() => {
    // setLoader(true);
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        axiosSecure.post("/jwt", user).then((res) => console.log(res.data));
      } else {
        axiosSecure.post("/logout", user).then((res) => console.log(res.data));
      }
      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    createUser,
    login,
    user,
    setUser,
    theme,
    toggleTheme,
    loading,
    setLoading,
    response,
    setResponse,
    errorMessage,
    setErrorMessage,
    changePassword,
    userProfileUpdate,
    signInWithGoogle,
    logOut,
    dbUser,
    setDbUser,
    liveBid,
    setLiveBid,
    walletBalance,
    setWalletBalance,

    //for dashboard navbar hide while chatting
    isMobile,
    setIsMobile,
    selectedUser,
    setSelectedUser,
  };

  return (
    <AuthContexts.Provider value={authInfo}>{children}</AuthContexts.Provider>
  );
};

export default AuthProvider;
