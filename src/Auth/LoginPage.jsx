// import React, { useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Swal from "sweetalert2";
// import biddingImg from "../assets/Logos/login.jpg";
// import SocialLogin from "../component/SocialLogin";
// import useAuth from "../hooks/useAuth";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const {loading,setLoading,login,errorMessage,setErrorMessage}=useAuth()
  
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");



//   const handleEmailPasswordLogin = async (e) => {
//     e.preventDefault();
//    setLoading(true);
//     setErrorMessage(null);

//     try {
//       const userCredential = await login(email, password);
//       setUser(userCredential.user);
//       Swal.fire({
//         title: "Login successful",
//         text: "Welcome back! Login successful",
//         icon: "success",
//       });
//       navigate("/");
//     } catch (err) {
//       console.error("Login error:", err.message);
//       setErrorMessage(err.message);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: `${err.message}`,
//       });
//     } finally {
//      setLoading(false);
//     }
//   };

 

//   return (
//     <div className="flex justify-center items-center p-4 sm:p-8 md:p-12 bg-gray-100 min-h-screen">
//       <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
//         {/* Image Section */}
//         <div
//           className="w-full md:w-1/2 min-h-[200px] sm:min-h-[300px] md:h-auto bg-cover bg-center"
//           style={{ backgroundImage: `url(${biddingImg})` }}
//         ></div>

//         {/* Login Form Section */}
//         <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gradient-to-b from-violet-50 to-violet-100">
//           <div className="flex mb-4 gap-2">
//             <NavLink
//               to="/login"
//               className="w-1/2 py-2 border border-purple-600 text-purple-600 font-semibold text-center rounded-md hover:bg-purple-600 hover:text-white transition-all"
//             >
//               Log In
//             </NavLink>
//             <NavLink
//               to="/register"
//               className="w-1/2 py-2 border border-orange-500 text-orange-500 font-semibold text-center rounded-md hover:bg-orange-500 hover:text-white transition-all"
//             >
//               Register
//             </NavLink>
//           </div>

//           <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 className="bg-white text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 className="bg-white text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center">
//                 <input type="checkbox" className="mr-2" /> Remember me
//               </label>
//               <Link
//                 to="/forgotPassword"
//                 className="text-purple-500 hover:underline"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
//               disabled={loading}
//             >
//               {loading ? "Loading..." : "Sign In"}
//             </button>
//           </form>

//           {errorMessage&& (
//             <p className="text-red-600 text-sm text-center mt-3">{errorMessage}</p>
//           )}

//           <SocialLogin />
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import biddingImg from "../assets/Logos/login.jpg";
import SocialLogin from "../component/SocialLogin";
import useAuth from "../hooks/useAuth";
import { toast } from "react-hot-toast"; // ✅ Hot toast

const LoginPage = () => {
  const navigate = useNavigate();
  const { loading, setLoading, login, setUser, errorMessage, setErrorMessage } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const userCredential = await login(email, password);
      setUser(userCredential.user);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      if (err.message.includes("auth/invalid-credential")) {
        setErrorMessage("Password is incorrect");
        toast.error("Password is incorrect");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 sm:p-8 md:p-12 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        <div
          className="w-full md:w-1/2 min-h-[200px] sm:min-h-[300px] md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${biddingImg})` }}
        ></div>

        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gradient-to-b from-violet-50 to-violet-100">
          <div className="flex mb-4 gap-2">
            <NavLink
              to="/login"
              className="w-1/2 py-2 border border-purple-600 text-purple-600 font-semibold text-center rounded-md hover:bg-purple-600 hover:text-white transition-all"
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className="w-1/2 py-2 border border-orange-500 text-orange-500 font-semibold text-center rounded-md hover:bg-orange-500 hover:text-white transition-all"
            >
              Register
            </NavLink>
          </div>

          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="bg-white text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="bg-white text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link
                to="/forgotPassword"
                className="text-purple-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>

          {errorMessage && (
            <p className="text-red-600 text-sm text-center mt-3">
              {errorMessage}
            </p>
          )}

          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
