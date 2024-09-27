import { useState } from "react";
import { PiUsersThreeDuotone as UsersIcon } from "react-icons/pi";
import { MdOutlineSpaceDashboard as DashboardIcon, MdTask as TaskIcon } from "react-icons/md";
import { GrUserWorker as WorkerIcon } from "react-icons/gr";
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
const OverviewSection = () => {
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,  // Disable animation
  };

  const doughnutData = {
    labels: ['Completed Tasks', 'Pending Tasks', 'In Progress'],
    datasets: [
      {
        label: '# of Tasks',
        data: [12, 19, 3],
        backgroundColor: [
          '#1F2937', // Black
          '#3B82F6', // Light blue
          '#CBD5E1', // Light gray
        ],
        borderColor: [
          '#1F2937',
          '#3B82F6',
          '#CBD5E1',
        ],
        borderWidth: 1,
      },
    ],
  };

  const workerData = {
    labels: ['Workers Present', 'Workers Absent'],
    datasets: [
      {
        label: '# of Workers',
        data: [15, 5],
        backgroundColor: [
          '#1F2937', // Black
          '#3B82F6', // Light blue
        ],
        borderColor: [
          '#1F2937',
          '#3B82F6',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [3, 2, 5, 1, 4, 2, 3],
        backgroundColor: '#3B82F6', // Light blue
        borderColor: '#1F2937', // Black
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,  
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
      <p className="text-gray-700">Here is an overview of your dashboard.</p>

      <div className="mt-6 flex gap-6">
        <div className="w-1/2 h-80">
          <h3 className="text-xl font-semibold text-gray-900">Task Overview</h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="w-1/2 h-80">
          <h3 className="text-xl font-semibold text-gray-900">Worker Presence</h3>
          <Doughnut data={workerData} options={doughnutOptions} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900">Weekly Task Progress</h3>
        <div className="w-full h-56"> {/* Slightly reduced height */}
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

const WorkersSection = () => {
  const presentWorkers = 15;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Workers</h2>
      <p className="text-gray-700 mb-6">Manage your workers here.</p>
      <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Workers Present</h3>
        <p className="text-gray-700">There are currently {presentWorkers} workers present today.</p>
      </div>
    </div>
  );
};

const TasksSection = () => {
  const currentDayTasks = [
    { name: 'Task 1', status: 'In Progress' },
    { name: 'Task 2', status: 'In Progress' },
    { name: 'Task 3', status: 'In Progress' },
  ]; // Example data

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tasks</h2>
      <p className="text-gray-700 mb-6">Manage your tasks here.</p>
      <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Today's In-Progress Tasks</h3>
        <ul className="text-gray-700">
          {currentDayTasks.map((task, index) => (
            <li key={index} className="mb-2">
              {task.name} - {task.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const LocationSection = () => {
  const locations = [
    {
      name: 'Location 1',
      workers: [
        { name: 'Worker A', status: 'Active' },
        { name: 'Worker B', status: 'Active' },
      ],
    },
    {
      name: 'Location 2',
      workers: [
        { name: 'Worker C', status: 'Active' },
        { name: 'Worker D', status: 'Inactive' },
      ],
    },
  ]; // Example data

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Locations</h2>
      <p className="text-gray-700 mb-6">Manage your locations here.</p>
      <div>
        {locations.map((location, index) => (
          <div key={index} className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{location.name}</h3>
            <p className="text-gray-700 mb-2">{location.workers.length} workers are working here.</p>
            <ul className="text-gray-700">
              {location.workers.map((worker, idx) => (
                <li key={idx} className="mb-1">
                  {worker.name} - {worker.status}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("overview");

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
        <h1 className="text-3xl font-bold flex items-center">
          Dashboard
        </h1>
        <ul className="flex space-x-4 mt-2">
          <li>
            <button
              className="bg-gray-800 text-white px-6 py-2 rounded shadow-md transform transition-transform hover:bg-light-blue duration-300"
              onClick={() => setSelectedSection("overview")}
            >
              Overview <DashboardIcon className="ml-2 inline" />
            </button>
          </li>
          <li>
            <button
              className="bg-gray-800 text-white px-6 py-2 rounded shadow-md transform transition-transform hover:bg-light-blue duration-300"
              onClick={() => setSelectedSection("location")}
            >
              Location <UsersIcon className="ml-2 inline" />
            </button>
          </li>
          <li>
            <button
              className="bg-gray-800 text-white px-6 py-2 rounded shadow-md transform transition-transform hover:bg-light-blue duration-300"
              onClick={() => setSelectedSection("workers")}
            >
              Workers <WorkerIcon className="ml-2 inline" />
            </button>
          </li>
          <li>
            <button
              className="bg-gray-800 text-white px-6 py-2 rounded shadow-md transform transition-transform hover:bg-light-blue duration-300"
              onClick={() => setSelectedSection("tasks")}
            >
              Tasks <TaskIcon className="ml-2 inline" />
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-grow p-8">
        {renderSection()}
      </div>
    </div>
  );
};
