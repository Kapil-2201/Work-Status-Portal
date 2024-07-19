import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { MdTask } from "react-icons/md";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";

export const Staffs = () => {
  const [open, setOpen] = useState(true);
  const [staffData, setStaffData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    staffId: "",
    designation: "",
    skill: "",
    status: "",
    image: "",
    otherSkill: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [notification, setNotification] = useState(""); // add a new state for notification

  const handleCreateNewStaff = () => {
    setShowPopup(true);
  };

  const handleAddStaff = () => {
    if (
      !newStaff.name ||
      !newStaff.email ||
      !newStaff.phone ||
      !newStaff.staffId ||
      !newStaff.designation ||
      !newStaff.skill ||
      !newStaff.status ||
      !newStaff.image
    ) {
      setNotification("All fields are required"); // set notification instead of alert
      return;
    }
    setStaffData([...staffData, newStaff]);
    setShowPopup(false);
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      staffId: "",
      designation: "",
      skill: "",
      status: "",
      image: "",
      otherSkill: "",
    });
    setNotification(""); // clear notification
  };

  const handleCancel = () => {
    setShowPopup(false);
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      staffId: "",
      designation: "",
      skill: "",
      status: "",
      image: "",
      otherSkill: "",
    });
    setNotification(""); // clear notification
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({...prevStaff, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setNewStaff((prevStaff) => ({...prevStaff, [name]: URL.createObjectURL(files[0]) }));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStaffData = staffData.filter((staff) => {
    if (filterOption === "all") {
      return (
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm) ||
        staff.staffId.includes(searchTerm) ||
        staff.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.otherSkill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return staff[filterOption].toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  return (
    <>
      <div className="flex">


        {/* Content section with search bar at right corner */}
        <div className="inline-block flex-grow p-7">
          <h2 className="text-2xl inline-block font-semibold">Staffs</h2>
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

                  <th className="px-4 py-2 border border-r-white">Profile Photo</th>
                  <th className="px-4 py-2 border border-r-white">Name</th>
                  <th className="px-4 py-2 border border-r-white">Email</th>
                  <th className="px-4 py-2 border border-r-white">Phone</th>
                  <th className="px-4 py-2 border border-r-white">Staff ID</th>
                  <th className="px-4 py-2 border border-r-white">Status</th>
                  <th className="px-4 py-2 border border-r-white">Designation</th>
                  <th className="px-4 py-2 border border-r-white">Skill</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaffData.map((staff, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                     <td className="px-4 py-2 border text-left">
                      <img src={staff.image} alt={staff.name} className="w-12 h-12 rounded-full" />
                    </td>
                    <td className="px-4 py-2 border text-left">{staff.name}</td>
                    <td className="px-4py-2 border text-left">{staff.email}</td>
                    <td className="px-4 py-2 border text-left">{staff.phone}</td>
                    <td className="px-4 py-2 border text-left">{staff.staffId}</td>
                    <td className="px-4 py-2 border text-left">{staff.status}</td>
                    <td className="px-4 py-2 border text-left">{staff.designation}</td>
                    <td className="px-4 py-2 border text-left">{staff.skill || staff.otherSkill}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="border border-light-blue px-5 py-2 rounded mt-7  text-light-blue duration-500  hover:bg-light-blue hover:text-white"
              onClick={handleCreateNewStaff}
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
                  <h2 className="text-2xl font-semibold">Create New Staff</h2>
                  <form>
                    <label>
                      Image:
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="p-2 w-full border rounded mt-2"
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Name:
                      <input
                        type="text"
                        name="name"
                        value={newStaff.name}
                        onChange={handleInputChange}
                        className="p-2 w-full border rounded mt-2"
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Email:
                      <input
                        type="email"
                        name="email"
                        value={newStaff.email}
                        onChange={handleInputChange}
                        className="p-2 w-full border rounded mt-2"
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Phone:
                      <input
                        type="text"
                        name="phone"
                        value={newStaff.phone}
                        onChange={handleInputChange}
                        className="p-2 w-full border rounded mt-2"
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Staff ID:
                      <input
                        type="text"
                        name="staffId"
                        value={newStaff.staffId}
                        onChange={handleInputChange}
                        className="p-2 w-full border rounded mt-2"
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Designation:
                      <select
                        name="designation"
                        value={newStaff.designation}
                        onChange={handleInputChange}
                        className="p-2 w-full border roundedmt-2"
                        required
                      >
                        <option value="">Select Designation</option>
                        <option value="Staff">Staff</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    </label>
                    <br />
                    <label>
                      Skill:
                      <select
                        name="skill"
                        value={newStaff.skill}
                        onChange={(e) => {
                          setNewStaff((prevStaff) => ({...prevStaff, skill: e.target.value}));
                          setNewStaff((prevStaff) => ({...prevStaff, otherSkill: ""}));
                        }}
                        className="p-2 w-full border rounded mt-2"
                        required
                      >
                        <option value="">Select Skill</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Mason">Mason</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Painter">Painter</option>
                        <option value="Others">Others</option>
                      </select>
                    </label>
                    <br />
                    {newStaff.skill === "Others" && (
                      <label>
                        Please specify:
                        <input
                          type="text"
                          name="otherSkill"
                          value={newStaff.otherSkill}
                          onChange={handleInputChange}
                          className="p-2 w-full border rounded mt-2"
                          required
                        />
                      </label>
                    )}
                    <br />
                    <label>
                      Status:
                      <select
                        name="status"
                        value={newStaff.status}
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
                        onClick={handleAddStaff}
                      >
                        Add Staff
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
