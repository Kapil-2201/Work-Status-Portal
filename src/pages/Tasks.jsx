import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const BASE_URL = "http://localhost:5173/api/task";


export const Tasks = () => {
  const [taskData, setTaskData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    taskid: "",
    nature: "",
    location: "",
    number: 1,
    workin: "",
    workout: "",
    status: "",
    remarks: "",
    reasonForDelay: "",
    staffNames: [""]
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchTaskData = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setTaskData(response.data);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setNotification("Failed to fetch task data");
    }
  };

  const handleCreateNewTask = () => {
    setShowPopup(true);
  };

  const handleAddTask = async () => {
    if (
      !newTask.taskid ||
      !newTask.nature ||
      !newTask.location ||
      !newTask.workin ||
      !newTask.status ||
      !newTask.number ||
      newTask.staffNames.some(name => !name.trim()) ||
      (newTask.status === "Delayed" && !newTask.reasonForDelay.trim())
    ) {
      setNotification("All fields are required and staff names must be provided. If status is Delayed, reason for delay must be provided.");
      return;
    }

    try {
      const response = await axios.post(BASE_URL, newTask);
      setTaskData([...taskData, response.data]);
      setShowPopup(false);
      setNewTask({
        taskid: "",
        nature: "",
        location: "",
        number: 1,
        workin: "",
        workout: "",
        status: "",
        remarks: "",
        reasonForDelay: "",
        staffNames: [""]
      });
      setNotification("");
    } catch (error) {
      console.error("Error adding new task:", error);
      setNotification("Failed to add task");
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setNewTask({
      taskid: "",
      nature: "",
      location: "",
      number: 1,
      workin: "",
      workout: "",
      status: "",
      remarks: "",
      reasonForDelay: "",
      staffNames: [""]
    });
    setNotification("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleNumberOfStaffChange = (e) => {
    const number = parseInt(e.target.value, 10) || 1;
    const staffNames = new Array(number).fill("");
    setNewTask(prevTask => ({
      ...prevTask,
      number,
      staffNames
    }));
  };

  const handleStaffNameChange = (index, e) => {
    const { value } = e.target;
    const staffNames = [...newTask.staffNames];
    staffNames[index] = value;
    setNewTask(prevTask => ({
      ...prevTask,
      staffNames
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleUpdateStatus = async (status, reasonForDelay) => {
    try {
      const updatedTask = { 
        status, 
        reasonForDelay 
      };
      const response = await axios.put(`${BASE_URL}/update/${selectedTask._id}`, updatedTask);
      
      // Update the taskData state with the modified task
      setTaskData(prevTasks =>
        prevTasks.map(task => 
          task._id === selectedTask._id ? response.data : task
        )
      );
  
      // Optionally clear the selected task or update as needed
      setSelectedTask(null);  // Clear the selected task if needed
  
      // Optionally show a notification or message
      setNotification("Task status updated successfully.");
    } catch (error) {
      console.error("Error updating task status:", error);
      setNotification("Failed to update task status");
    }
  };
  
  

  const filteredTaskData = taskData.filter(task =>
    Object.values(task).some(
      value =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <div className="flex">
        <div className="inline-block flex-grow p-7">
          {showTaskDetails ? (
            <div>
              <h2 className="text-2xl font-semibold">Task Details</h2>
              <div className="border p-4 rounded mt-4">
                <p><strong>Task Id:</strong> {selectedTask.taskid}</p>
                <p><strong>Nature of Work:</strong> {selectedTask.nature}</p>
                <p><strong>Location:</strong> {selectedTask.location}</p>
                <p><strong>Number of Staff:</strong> {selectedTask.number}</p>
                <p><strong>Work In:</strong> {selectedTask.workin}</p>
                <p><strong>Work Out:</strong> {selectedTask.workout}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
                {selectedTask.status === "Delayed" && (
                  <p><strong>Reason for Delay:</strong> {selectedTask.reasonForDelay}</p>
                )}
                <p><strong>Remarks:</strong> {selectedTask.remarks}</p>
                <p><strong>Staff Names:</strong></p>
                <ul>
                  {selectedTask.staffNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <button
                    className="border border-light-blue px-5 py-2 rounded text-light-blue duration-500 hover:bg-light-blue hover:text-white"
                    onClick={() => setShowTaskDetails(false)}
                  >
                    Back to List
                  </button>
                  <button
                    className="border border-green-500 text-green-500 px-5 py-2 rounded ml-4 hover:bg-green-500 hover:text-white duration-500"
                    onClick={() => handleUpdateStatus('Completed')}
                  >
                    Mark as Completed
                  </button>
                  <button
                    className="border border-yellow-500 text-yellow-500 px-5 py-2 rounded ml-4 hover:bg-yellow-500 hover:text-white duration-500"
                    onClick={() => handleUpdateStatus('In Progress')}
                  >
                    Mark as In Progress
                  </button>
                  <button
                    className="border border-red-500 text-red-500 px-5 py-2 rounded ml-4 hover:bg-red-500 hover:text-white duration-500"
                    onClick={() => handleUpdateStatus('Delayed', selectedTask.reasonForDelay)}
                  >
                    Mark as Delayed
                  </button>
                </div>
              </div>
              {notification && (
                <div className="bg-green-100 text-green-500 p-2 rounded mb-4 mt-5">
                  {notification}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl inline-block font-semibold">Tasks</h2>
              <input
                type="search"
                className="p-4 mt-7 border rounded h-2 w-full flex-grow ml-auto"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="flex flex-col items-end">
                <table className="border border-collapse w-full mt-4">
                  <thead>
                    <tr className="bg-gray-200 text-sm font-medium">
                      <th className="px-4 py-2">Task Id</th>
                      <th className="px-4 py-2">Nature of Work</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">Number Of Staffs</th>
                      <th className="px-4 py-2">Work In</th>
                      <th className="px-4 py-2">Work Out</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTaskData.map((task, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleViewTask(task)}
                      >
                        <td className="px-4 py-2 border text-left">{task.taskid}</td>
                        <td className="px-4 py-2 border text-left">{task.nature}</td>
                        <td className="px-4 py-2 border text-left">{task.location}</td>
                        <td className="px-4 py-2 border text-left">{task.number}</td>
                        <td className="px-4 py-2 border text-left">{task.workin}</td>
                        <td className="px-4 py-2 border text-left">{task.workout}</td>
                        <td className="px-4 py-2 border text-left">{task.status}</td>
                        <td className="px-4 py-2 border text-left">{task.remarks}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="border border-light-blue px-5 py-2 rounded mt-7 text-light-blue duration-500 hover:bg-light-blue hover:text-white"
                  onClick={handleCreateNewTask}
                >
                  Create New Task
                </button>
                {showPopup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center"
                  >
                    <motion.div
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-4 rounded w-1/2"
                    >
                      <h2 className="text-2xl font-semibold">Create New Task</h2>
                      <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                        <label>
                          Task Id:
                          <input
                            type="text"
                            name="taskid"
                            value={newTask.taskid}
                            onChange={handleInputChange}
                            className="p-2 w-full border rounded mt-2"
                            required
                          />
                        </label>
                        <br />
                        <label>
                          Nature:
                          <input
                            type="text"
                            name="nature"
                            value={newTask.nature}
                            onChange={handleInputChange}
                            className="p-2 w-full border rounded mt-2"
                            required
                          />
                        </label>
                        <br />
                        <label>
                          Location:
                          <input
                            type="text"
                            name="location"
                            value={newTask.location}
                            onChange={handleInputChange}
                            className="p-2 w-full border rounded mt-2"
                            required
                          />
                        </label>
                        <br />
                        <label>
                          Number of Staff:
                          <input
                            type="number"
                            name="number"
                            value={newTask.number}
                            min="1"
                            max="10"
                            onChange={handleNumberOfStaffChange}
                            className="p-2 w-full border rounded mt-2"
                            required
                          />
                        </label>
                        <br />
                        {newTask.staffNames.map((name, index) => (
                          <label key={index}>
                            Staff Name {index + 1}:
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => handleStaffNameChange(index, e)}
                              className="p-2 w-full border rounded mt-2"
                              required
                            />
                          </label>
                        ))}
                        <br />
                        <label>
                          Work In:
                          <input
                            type="text"
                            name="workin"
                            value={newTask.workin}
                            onChange={handleInputChange}
                            className="p-2 w-full border rounded mt-2"
                            required
                          />
                        </label>
                        <br />
                        <label>
                          Work Out:
                          <input
                            type="text"
                            name="workout"
                            value={newTask.workout}
                            onChange={handleInputChange}
                            className="p-2 w-full border rounded mt-2"
                            required
                          />
                        </label>
                        <br />
                        <label>
                          Status:
                          <select
                            name="status"
                            value={newTask.status}
                            onChange={handleInputChange}
                            className="p-2 w-full border rounded mt-2"
                            required
                          >
                            <option value="">Select Status</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                          </select>
                        </label>
                        <br />
                        {newTask.status === "Delayed" && (
                          <label>
                            Reason for Delay:
                            <input
                              type="text"
                              name="reasonForDelay"
                              value={newTask.reasonForDelay}
                              onChange={handleInputChange}
                              className="p-2 w-full border rounded mt-2"
                            />
                          </label>
                        )}
                        <br />
                        <label>
                          Remarks:
                          <textarea
                            name="remarks"
                            value={newTask.remarks}
                            onChange={handleInputChange}
                            className="p-2 w-full border rounded mt-2"
                          />
                        </label>
                        <br />
                        <div className="flex justify-end gap-x-4">
                          <button
                            type="button"
                            className="border border-red-500 text-red-500 px-5 py-1 rounded mt-5 hover:bg-red-500 hover:text-white duration-300"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="border border-light-blue text-light-blue px-5 py-1 mt-5 rounded hover:bg-light-blue hover:text-white duration-300"
                          >
                            Add Task
                          </button>
                        </div>
                      </form>
                      {notification && (
                        <div className="bg-red-100 text-red-500 p-2 rounded mb-4 mt-5">
                          {notification}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};