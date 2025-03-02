import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoMdLogIn as LoginIcon } from "react-icons/io";
import { AiOutlineLoading3Quarters as LoadingIcon } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from '../components/logo.png';
export const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const navigate = useNavigate();
  
  // For this standalone component, we'll use localStorage
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate("/");
    }
    
    // Check if we have saved credentials in localStorage
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setCredentials(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear login error when user changes any field
    if (loginError) {
      setLoginError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setLoginError("");
    
    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for demo purposes
      if (credentials.email === "admin@example.com" && credentials.password === "password123") {
        // Save user info
        const userData = {
          id: "user-123",
          name: "Admin User",
          email: credentials.email,
          role: "admin"
        };
        
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", credentials.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        
        navigate("/");
      } else {
        setLoginError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.response?.data?.message || 
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-2">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
          {/* Header with updated logo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-3">
                <img 
                
                 src={logo} alt="Logo"
                 
                  className="h-12 w-12 rounded-full border-2 border-white shadow-md"
                />
              </div>
              <h1 className="text-white text-2xl font-bold text-center flex items-center justify-center">
               
                Campus Maintainance
              </h1>
            </div>
          </div>
          
          {/* Welcome message */}
          <div className="bg-gray-50 px-6 py-3 text-center">
            <p className="text-gray-600">Welcome back! Please login to your account</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-5">
            {/* Display login error if any */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{loginError}</span>
              </div>
            )}
            
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={credentials.email}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
            
            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">
                  Password
                </label>

              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
            

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium text-center"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
            
          </form>
          
        
        </div>
      </div>
    </div>
  );
};

export default LoginPage;