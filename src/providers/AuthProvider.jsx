import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.init";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAxiosPublic from "../hooks/useAxiosPublic";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContexts = createContext("");

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [response, setResponse] = useState(null);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loader, setLoader] = useState(true);

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

  const createUser = async (email, password) => {
    setLoader(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } finally {
      setLoader(false);
    }
  };

  const signInUser = async (email, password) => {
    setLoader(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } finally {
      setLoader(false);
    }
  };

  const signOutUser = async () => {
    setLoader(true);
    try {
      await signOut(auth);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        axiosSecure.post("/jwt").then((res) => setResponse(res));
        axiosPublic
          .post("/user", {
            email: currentUser?.email || "demo user",
            displayName: currentUser?.displayName || "demo displayName",
          })
          .then((res) => setResponse(res))
          .catch((err) => {
            console.error(
              "Error adding user:",
              err.response?.data || err.message
            );
          });
      } else {
        axiosSecure.post("/logout").then((res) => setResponse(res));
      }
      setLoader(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    createUser,
    signInUser,
    signOutUser,
    user,
    setUser,
    theme,
    toggleTheme,
    loader,
    setLoader,
    response,
    setResponse,
  };

  return (
    <AuthContexts.Provider value={authInfo}>{children}</AuthContexts.Provider>
  );
};

export default AuthProvider;
