import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/task`;

export const Tasks = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState([]);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchTaskData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(BASE_URL);
      setTaskData(response.data || []);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setNotification("Failed to fetch task data");
      setTaskData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleUpdateStatus = async (status) => {
    try {
      if (!selectedTask || !selectedTask._id) {
        setNotification("Error: Invalid task selected");
        return;
      }

      let reasonForDelay = '';
      if (status === 'Delayed') {
        reasonForDelay = prompt("Please enter reason for delay:", selectedTask?.reasonForDelay || '');
        if (!reasonForDelay) {
          setNotification("Reason for delay is required");
          return;
        }
      }

      // Show loading notification immediately
      setNotification("Updating status...");

      const updateData = {
        status,
        reasonForDelay: status === 'Delayed' ? reasonForDelay : '',
        taskid: selectedTask.taskid,
        nature: selectedTask.nature,
        location: selectedTask.location,
        number: selectedTask.number,
        staffNames: selectedTask.staffNames || [],
        workin: selectedTask.workin,
        workout: selectedTask.workout,
        remarks: selectedTask.remarks
      };

      const response = await axios.put(`${BASE_URL}/update/${selectedTask._id}`, updateData);
      
      // Show success notification immediately
      setNotification("Task status updated successfully");
      
      // Refresh data and navigate
      await fetchTaskData();
      setShowTaskDetails(false);
      setSelectedTask(null);
      
      // Clear notification after a shorter delay
      setTimeout(() => setNotification(""), 2000);
    } catch (error) {
      console.error("Error updating task status:", error);
      setNotification("Failed to update task status");
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const filteredTaskData = taskData?.filter(task =>
    Object.values(task).some(
      value =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Show notification at the top */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${
            notification.includes('error') || notification.includes('failed')
              ? 'bg-red-100 text-red-800'
              : notification.includes('Updating')
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {notification}
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks Management</h1>
        <button
          onClick={() => navigate('/create-task')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-light-blue transition-colors"
        >
          Create New Task
        </button>
      </div>

      {!showTaskDetails ? (
        <>
          <div className="mb-4">
            <input
              type="search"
              className="w-full p-3 border rounded-lg shadow-sm"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nature</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTaskData.map((task) => (
                      <tr
                        key={task._id}
                        onClick={() => handleViewTask(task)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{task.taskid}</td>
                        <td className="px-6 py-4">{task.nature}</td>
                        <td className="px-6 py-4">{task.location}</td>
                        <td className="px-6 py-4">{task.number}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <TaskDetails
          task={selectedTask}
          onBack={() => setShowTaskDetails(false)}
          onUpdateStatus={handleUpdateStatus}
          notification={notification}
        />
      )}
    </div>
  );
};

const TaskDetails = ({ task, onBack, onUpdateStatus, notification }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">Task Details</h2>
      <button
        onClick={onBack}
        className="text-gray-600 hover:text-gray-900"
      >
        ← Back to List
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DetailItem label="Task ID" value={task.taskid} />
      <DetailItem label="Nature of Work" value={task.nature} />
      <DetailItem label="Location" value={task.location} />
      <DetailItem label="Number of Staff" value={task.number} />
      <DetailItem label="Work In" value={task.workin} />
      <DetailItem label="Work Out" value={task.workout} />
      <DetailItem label="Status" value={task.status} />
      {task.status === "Delayed" && (
        <DetailItem label="Reason for Delay" value={task.reasonForDelay} />
      )}
      <DetailItem label="Remarks" value={task.remarks} />
    </div>

    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Staff Names</h3>
      <ul className="space-y-2">
        {task.staffNames.map((name, index) => (
          <li key={index} className="text-gray-600">{name}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6 flex gap-4">
      <StatusButton
        onClick={() => onUpdateStatus('Completed')}
        className="bg-green-50 text-green-700 hover:bg-green-100"
      >
        Mark as Completed
      </StatusButton>
      <StatusButton
        onClick={() => onUpdateStatus('In Progress')}
        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
      >
        Mark as In Progress
      </StatusButton>
      <StatusButton
        onClick={() => onUpdateStatus('Delayed')}
        className="bg-red-50 text-red-700 hover:bg-red-100"
      >
        Mark as Delayed
      </StatusButton>
    </div>

    {notification && (
      <div className="mt-4 p-4 rounded-lg bg-blue-50 text-blue-700">
        {notification}
      </div>
    )}
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);

const StatusButton = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${className}`}
  >
    {children}
  </button>
);

export default Tasks;


