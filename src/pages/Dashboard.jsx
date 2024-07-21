import { useState } from "react";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { MdTask } from "react-icons/md";

export const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("overview");

  const renderSection = () => {
    switch (selectedSection) {
      case "overview":
        return (
          <div>
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p>Here is an overview of your dashboard.</p>
          </div>
        );
      case "users":
        return (
          <div>
            <h2 className="text-2xl font-semibold">Users</h2>
            <p>Manage your users here.</p>
          </div>
        );
      case "workers":
        return (
          <div>
            <h2 className="text-2xl font-semibold">Workers</h2>
            <p>Manage your workers here.</p>
          </div>
        );
      case "tasks":
        return (
          <div>
            <h2 className="text-2xl font-semibold">Tasks</h2>
            <p>Manage your tasks here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex">

        <div className="inline-block flex-grow p-7">
          <h2 className="text-2xl inline-block font-semibold">Dashboard</h2>
          
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
              onClick={() => setSelectedSection("overview")}
            >
              Overview <MdOutlineSpaceDashboard className="inline-block ml-1" />
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
              onClick={() => setSelectedSection("users")}
            >
              Users <PiUsersThreeDuotone className="inline-block ml-1" />
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 mr-2 rounded"
              onClick={() => setSelectedSection("workers")}
            >
              Workers <GrUserWorker className="inline-block ml-1" />
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedSection("tasks")}
            >
              Tasks <MdTask className="inline-block ml-1" />
            </button>
          </div>
          
          <div className="mt-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </>
  );
};
