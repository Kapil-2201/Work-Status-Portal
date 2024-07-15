import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { MdTask } from "react-icons/md";
import { motion } from "framer-motion";

export const Tasks = () => {
  const [open, setOpen] = useState(true);
  const [taskData, setTaskData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState({
    taskid: "",
      nature: "",
      location: "",
      number: "",
      workin: "",
      workout: "",
      status: "",
      remarks: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [notification, setNotification] = useState(""); // add a new state for notification

  const handleCreateNewTask = () => {
    setShowPopup(true);
  };

  const handleAddTask = () => {
    if (
      !newTask.taskid ||
      !newTask.nature ||
      !newTask.location||
      !newTask.workin ||
      !newTask.status ||
      !newTask.number 
    ) {
      setNotification("All fields are required"); // set notification instead of alert
      return;
    }
    setTaskData([...taskData, newTask]);
    setShowPopup(false);
    setNewTask({
      taskid: "",
      nature: "",
      location: "",
      number: "",
      workin: "",
      workout: "",
      status: "",
      remarks: "",
    });
    setNotification(""); // clear notification
  };

  const handleCancel = () => {
    setShowPopup(false);
    setNewTask({
        taskid: "",
        nature: "",
        location: "",
        number: "",
        workin: "",
        workout: "",
        status: "",
        remarks: "",
    });
    setNotification(""); // clear notification
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({...prevTask, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setNewTask((prevTask) => ({...prevTask, [name]: URL.createObjectURL(files[0]) }));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTaskData = taskData.filter((task) => {
    if (filterOption === "all") {
      return (
        task.taskid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.nature.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.location.includes(searchTerm) ||
        task.number.includes(searchTerm) ||
        task.workin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.workout.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.remarks.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return task[filterOption].toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  return (
    <>
      <div className="flex">
        {/* Sidebar section */}
        {/* <div
          className={`bg-dark-blue h-screen p-5 pt-8 ${
            open? "w-72" : "w-20"
          } duration-300 relative`}
        >
          <BsArrowLeft
            className={`bg-white text-3xl absolute -right-3 top-9 rounded-full border-2 border-dark-blue cursor-pointer ${
            !open && "rotate-180 duration-300"
            }`}
            onClick={() => setOpen(!open)}
          />
          <div className="inline-flex">
            <PiUsersThreeDuotone className="text-light-blue text-4xl rounded cursor-pointer block float-left mr-2" />
            <h3
              className={`text-white origin-left font-medium text-lg mt-1 duration-50 ${
              !open && "hidden"
              }`}
            >
              WORK STATUS PORTAL
            </h3>
          </div>
          <ul className="pt-2">
            <li
              className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 hover:bg-light-blue
              }  rounded duration-300 mt-2`}
            >
              <span className="text-2xl block float-left">
                <MdOutlineSpaceDashboard />
              </span>
              <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                Dashboard
              </span>
            </li>
            <li className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 bg-light-blue
              }  rounded duration-300 mt-2`}
            >
              <span className="text-2xl block float-left">
                <MdTask />
              </span>
              <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                Task
              </span>
            </li>
            <li
              className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 hover:bg-light-blue
              }  rounded duration-300 mt-2`}
            >
              <span className="text-2xl block float-left">
                <GrUserWorker />
              </span>
              <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                Staff
              </span>
            </li>
          </ul>
        </div> */}

        {/* Content section with search bar at right corner */}
        <div className="inline-block flex-grow p-7">
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

                  <th className="px-4 py-2">Nature of work</th>
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
                  <tr key={index} className="border-b hover:bg-gray-100">
                     
                    <td className="px-4 py-2 border text-left">{task.taskid}</td>
                    <td className="px-4py-2 border text-left">{task.nature}</td>
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
              className="border border-light-blue px-5 py-2 rounded mt-7  text-light-blue duration-500  hover:bg-light-blue hover:text-white"
              onClick={handleCreateNewTask}
            >
              Create New Staff
            </button>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center"
              >
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded w-1/2"
                >
                  <h2 className="text-2xl font-semibold">Create New Task</h2>
                  <form>
                   
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
                        value={newTask.email}
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
                        name="loctaion"
                        value={newTask.location}
                        onChange={handleInputChange}
                        className="p-2 w-full border rounded mt-2"
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Number of Essential Staff:
                      <input
                        type="text"
                        name="number"
                        value={newTask.number}
                        onChange={handleInputChange}
                        className="p-2 w-full border rounded mt-2"
                        required
                      />
                    </label>
                    <br />
                    <label>
                      WorkIn:
                      <input
                      type="text"
                        name="in"
                        value={newTask.workin}
                        onChange={handleInputChange}
                        className="p-2 w-full border roundedmt-2"
                        required
                      />
                        
                      
                    </label>
                   
                    <br />
                    <label>
                      WorkOut:
                      <input
                      type="text"
                        name="out"
                        value={newTask.workout}
                        onChange={handleInputChange}
                        className="p-2 w-full border roundedmt-2"
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
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </label>
                    <br />
                    <div className="flex justify-end gap-x-4">
                      <button
                        className="border border-red-500 text-red-500 px-5 py-1 rounded mt-5 hover:bg-red-500 hover:text-white duration-300"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className="border border-light-blue text-light-blue px-5 py-1 mt-5 rounded hover:bg-light-blue hover:text-white duration-300"
                        onClick={handleAddTask}
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
      </div>
    </>
  );
};