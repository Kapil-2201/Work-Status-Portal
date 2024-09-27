import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const BASE_URL = "http://localhost:5173/api/staff";

export const Staffs = () => {
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
    otherSkill: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setStaffData(response.data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setNotification("Failed to fetch staff data");
    }
  };

  const handleCreateNewStaff = () => {
    setShowPopup(true);
  };

  const handleAddStaff = async () => {
    try {
      const response = await axios.post(BASE_URL, newStaff);
      console.log("Staff added successfully:", response.data);
      setNotification("Staff added successfully!");
      fetchStaffData(); // Refresh the staff data after adding
      handleCancel(); // Reset the form and close the popup
    } catch (error) {
      console.error("Error adding new staff member:", error);
      setNotification("Error adding staff member.");
    }
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
      otherSkill: "",
    });
    setNotification("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({ ...prevStaff, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStaffData = staffData.filter((staff) =>
    Object.values(staff).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex">
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
                  <td className="px-4 py-2 border text-left">{staff.name}</td>
                  <td className="px-4 py-2 border text-left">{staff.email}</td>
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
            className="border border-light-blue px-5 py-2 rounded mt-7 text-light-blue duration-500 hover:bg-light-blue hover:text-white"
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
              className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded w-1/2"
              >
                <h2 className="text-2xl font-semibold">Create New Staff</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddStaff();
                  }}
                >
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
                      className="p-2 w-full border rounded mt-2"
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
                        setNewStaff((prevStaff) => ({
                          ...prevStaff,
                          skill: e.target.value,
                          otherSkill: "",
                        }));
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
                  <button
                    type="submit"
                    className="mt-4 px-5 py-2 rounded bg-light-blue text-white"
                  >
                    Add Staff
                  </button>
                  <button
                    type="button"
                    className="mt-4 px-5 py-2 rounded bg-gray-400 text-white ml-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
          {notification && (
            <div className="mt-4 text-red-600 font-semibold">
              {notification}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staffs;
