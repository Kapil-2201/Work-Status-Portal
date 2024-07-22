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
  };

  const doughnutData = {
    labels: ['Completed Tasks', 'Pending Tasks', 'In Progress'],
    datasets: [
      {
        label: '# of Tasks',
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
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
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Task 1', 'Task 2', 'Task 3', 'Task 4'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [3, 2, 5, 1],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Overview</h2>
      <p>Here is an overview of your dashboard.</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Task Overview</h3>
        <div className="w-64 h-64">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Worker Presence</h3>
        <div className="w-64 h-64">
          <Doughnut data={workerData} options={doughnutOptions} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Tasks Progress</h3>
        <div className="w-64 h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

const UsersSection = () => (
  <div>
    <h2 className="text-2xl font-semibold">Users</h2>
    <p>Manage your users here.</p>
  </div>
);

const WorkersSection = () => (
  <div>
    <h2 className="text-2xl font-semibold">Workers</h2>
    <p>Manage your workers here.</p>
  </div>
);

const TasksSection = () => (
  <div>
    <h2 className="text-2xl font-semibold">Tasks</h2>
    <p>Manage your tasks here.</p>
  </div>
);

export const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("overview");

  const renderSection = () => {
    switch (selectedSection) {
      case "overview":
        return <OverviewSection />;
      case "users":
        return <UsersSection />;
      case "workers":
        return <WorkersSection />;
      case "tasks":
        return <TasksSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="inline-block flex-grow p-7">
        <h2 className="text-2xl inline-block font-semibold">Dashboard</h2>
        
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
            onClick={() => setSelectedSection("overview")}
          >
            Overview <DashboardIcon className="inline-block ml-1" />
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
            onClick={() => setSelectedSection("users")}
          >
            Users <UsersIcon className="inline-block ml-1" />
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 mr-2 rounded"
            onClick={() => setSelectedSection("workers")}
          >
            Workers <WorkerIcon className="inline-block ml-1" />
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setSelectedSection("tasks")}
          >
            Tasks <TaskIcon className="inline-block ml-1" />
          </button>
        </div>
        
        <div className="mt-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
