// Location Section with location-wise tasks and staff data
import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
const LocationSection = () => {
    const [locations, setLocations] = useState([]);
    const [tasksByLocation, setTasksByLocation] = useState({});
    const [staffByLocation, setStaffByLocation] = useState({});
    const [selectedLocation, setSelectedLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      fetchLocationData();
    }, []);
  
    const fetchLocationData = async () => {
      setLoading(true);
      try {
        // Fetch tasks
        const taskResponse = await axios.get('http://localhost:5173/api/task');
        const tasks = taskResponse.data;
  
        // Fetch staff
        const staffResponse = await axios.get('http://localhost:5173/api/staff');
        const staff = staffResponse.data;
  
        // Get unique locations from tasks
        const uniqueLocations = [...new Set(tasks.map(task => task.location))].filter(Boolean);
        
        // Group tasks by location
        const taskData = {};
        uniqueLocations.forEach(location => {
          taskData[location] = tasks.filter(task => task.location === location);
        });
  
        // Create mapping of staff to locations based on tasks
        const staffData = {};
        uniqueLocations.forEach(location => {
          // Get all tasks for this location
          const locationTasks = taskData[location];
          
          // Extract all staff names from these tasks
          const staffNames = new Set();
          locationTasks.forEach(task => {
            if (task.staffNames && Array.isArray(task.staffNames)) {
              task.staffNames.forEach(name => staffNames.add(name));
            }
          });
          
          // Store staff names for this location
          staffData[location] = Array.from(staffNames);
        });
  
        setLocations(uniqueLocations);
        setTasksByLocation(taskData);
        setStaffByLocation(staffData);
        
        // Set first location as selected if available
        if (uniqueLocations.length > 0) {
          setSelectedLocation(uniqueLocations[0]);
        }
  
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError("Failed to fetch location data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    // Get tasks for the selected location
    const selectedLocationTasks = selectedLocation ? tasksByLocation[selectedLocation] || [] : [];
    
    // Get staff for the selected location
    const selectedLocationStaff = selectedLocation ? staffByLocation[selectedLocation] || [] : [];
  
    // Calculate statistics for selected location
    const locationStats = {
      total: selectedLocationTasks.length,
      completed: selectedLocationTasks.filter(task => task.status === 'Completed').length,
      inProgress: selectedLocationTasks.filter(task => task.status === 'In Progress').length,
      delayed: selectedLocationTasks.filter(task => task.status === 'Delayed').length,
      staffCount: selectedLocationStaff.length
    };
  
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-blue-100 text-blue-800';
        case 'Delayed': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Location Management</h2>
        <p className="text-gray-700">View tasks and staff by location.</p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {locations.length === 0 ? (
              <div className="mt-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                No locations found. Create tasks with locations to see data here.
              </div>
            ) : (
              <>
                <div className="mt-6">
                  <label htmlFor="location-select" className="block text-sm font-medium text-gray-700">
                    Select Location
                  </label>
                  <select
                    id="location-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Location Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-800">
                    <div className="text-sm text-gray-500">Total Tasks</div>
                    <div className="text-2xl font-bold">{locationStats.total}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="text-sm text-gray-500">Completed</div>
                    <div className="text-2xl font-bold">{locationStats.completed}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="text-sm text-gray-500">In Progress</div>
                    <div className="text-2xl font-bold">{locationStats.inProgress}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <div className="text-sm text-gray-500">Delayed</div>
                    <div className="text-2xl font-bold">{locationStats.delayed}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                    <div className="text-sm text-gray-500">Staff Assigned</div>
                    <div className="text-2xl font-bold">{locationStats.staffCount}</div>
                  </div>
                </div>
                
                {/* Tasks at this location */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900">Tasks at {selectedLocation}</h3>
                  <div className="mt-2 bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nature</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work In</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Out</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedLocationTasks.length > 0 ? (
                            selectedLocationTasks.map((task) => (
                              <tr key={task._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{task.taskid}</td>
                                <td className="px-6 py-4">{task.nature}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">{task.number}</td>
                                <td className="px-6 py-4">{new Date(task.workin).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{task.workout ? new Date(task.workout).toLocaleDateString() : 'N/A'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No tasks found for this location</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Staff assigned to this location */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900">Staff Working at {selectedLocation}</h3>
                  <div className="mt-2">
                    {selectedLocationStaff.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedLocationStaff.map((staffName, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-700">{staffName.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{staffName}</div>
                                <div className="text-sm text-gray-500">Assigned to this location</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                        No staff are currently assigned to this location.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  export default LocationSection;