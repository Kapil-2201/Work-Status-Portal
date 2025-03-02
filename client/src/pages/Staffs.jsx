import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from '../config';
// const BASE_URL = "http://localhost:5173/api/staff";

export const Staffs = () => {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(BASE_URL);
      setStaffData(response.data || []);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setNotification("Failed to fetch staff data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStaffData = staffData?.filter((staff) =>
    Object.values(staff).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${
            notification.includes('error') || notification.includes('failed')
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {notification}
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={() => navigate('/create-staff')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-light-blue transition-colors"
        >
          Create New Staff
        </button>
      </div>

      <div className="mb-4">
        <input
          type="search"
          className="w-full p-3 border rounded-lg shadow-sm"
          placeholder="Search staff..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaffData.map((staff, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{staff.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{staff.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{staff.staffId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staff.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{staff.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{staff.skill || staff.otherSkill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staffs;
