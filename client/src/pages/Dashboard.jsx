import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { PiUsersThreeDuotone as UsersIcon } from "react-icons/pi";
import { MdOutlineSpaceDashboard as DashboardIcon, MdTask as TaskIcon } from "react-icons/md";
import { IoMdLogIn as LoginIcon, IoMdLogOut as LogoutIcon } from "react-icons/io";
import { GrUserWorker as WorkerIcon } from "react-icons/gr";
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import TasksSection from "../components/TasksSection";
import WorkersSection from "../components/WorkersSection";

import LocationSection from "../components/LocationSection";
import OverviewSection from "../components/OverviewSection";


export const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on component mount
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    
    // Get user data if authenticated
    if (authStatus) {
      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    
    // Update state
    setIsAuthenticated(false);
    setUserData(null);
    
    // Navigate to login page
    navigate("/login");
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "overview":
        return <OverviewSection />;
      case "location":
        return <LocationSection />;
      case "workers":
        return <WorkersSection />;
      case "tasks":
        return <TasksSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <div className="bg-white text-gray-900 p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">Dashboard</h1>
          
          {/* Conditional rendering of Login/Logout button */}
          {isAuthenticated ? (
            <div className="flex items-center">
              {userData && (
                <span className="mr-4 text-gray-700">
                  Welcome, <span className="font-semibold">{userData.name}</span>
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
              >
                <LogoutIcon className="mr-2" /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <LoginIcon className="mr-2" /> Login
            </Link>
          )}
        </div>
        
        <ul className="flex space-x-4 mt-4">
          <li>
            <button
              className={`px-6 py-2 rounded transition-colors flex items-center ${
                selectedSection === "overview" 
                  ? "bg-gray-800 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedSection("overview")}
            >
              <DashboardIcon className="mr-2" /> Overview
            </button>
          </li>
          <li>
            <button
              className={`px-6 py-2 rounded transition-colors flex items-center ${
                selectedSection === "location" 
                  ? "bg-gray-800 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedSection("location")}
            >
              <UsersIcon className="mr-2" /> Location
            </button>
          </li>
          <li>
            <button
              className={`px-6 py-2 rounded transition-colors flex items-center ${
                selectedSection === "workers" 
                  ? "bg-gray-800 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedSection("workers")}
            >
              <WorkerIcon className="mr-2" /> Workers
            </button>
          </li>
          <li>
            <button
              className={`px-6 py-2 rounded transition-colors flex items-center ${
                selectedSection === "tasks" 
                  ? "bg-gray-800 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedSection("tasks")}
            >
              <TaskIcon className="mr-2" /> Tasks
            </button>
          </li>
        </ul>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow p-6">
        {renderSection()}
      </div>
    </div>
  );
};

export default Dashboard;