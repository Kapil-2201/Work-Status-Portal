// Modified Overview Section with highlights from other section components
import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const OverviewSection = () => {
  // State for all data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Task-related state
  const [taskStats, setTaskStats] = useState({ completed: 0, delayed: 0, inProgress: 0 });
  const [tasksByLocation, setTasksByLocation] = useState({});
  const [taskTypes, setTaskTypes] = useState({});
  const [recentTasks, setRecentTasks] = useState([]);
  
  // Worker-related state
  const [workerStats, setWorkerStats] = useState({ present: 0, absent: 0 });
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [consistentWorkers, setConsistentWorkers] = useState([]);
  
  // Location-related state
  const [locations, setLocations] = useState([]);
  const [topLocation, setTopLocation] = useState({ name: "", count: 0 });
  const [staffByLocation, setStaffByLocation] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch all required data in parallel
        const [taskResponse, staffResponse, attendanceResponse] = await Promise.all([
          axios.get('https://work-status-portal-backend.vercel.app/api/task'),
          axios.get('https://work-status-portal-backend.vercel.app/api/staff'),
          axios.get('https://work-status-portal-backend.vercel.app/attendance/history')
        ]);
        
        const tasks = taskResponse.data || [];
        const staff = staffResponse.data || [];
        const attendanceHistory = attendanceResponse.data.attendance || attendanceResponse.data || {};
        
        // Process tasks data
        processTasksData(tasks);
        
        // Process workers data
        processWorkersData(staff, attendanceHistory);
        
        // Process location data
        processLocationData(tasks, staff);
        
      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);
  
  // Process tasks data
  const processTasksData = (tasks) => {
    // Calculate task statistics
    const completed = tasks.filter(task => task.status === 'Completed').length;
    const delayed = tasks.filter(task => task.status === 'Delayed').length;
    const inProgress = tasks.filter(task => task.status === 'In Progress').length;
    setTaskStats({ completed, delayed, inProgress });
    
    // Get tasks by location
    const locationData = {};
    tasks.forEach(task => {
      if (task.location) {
        locationData[task.location] = (locationData[task.location] || 0) + 1;
      }
    });
    setTasksByLocation(locationData);
    
    // Find top location
    const sortedLocations = Object.entries(locationData).sort((a, b) => b[1] - a[1]);
    if (sortedLocations.length > 0) {
      setTopLocation({ name: sortedLocations[0][0], count: sortedLocations[0][1] });
    }
    
    // Get task types
    const types = {};
    tasks.forEach(task => {
      const nature = task.nature || 'Unspecified';
      types[nature] = (types[nature] || 0) + 1;
    });
    setTaskTypes(types);
    
    // Get recent tasks (last 5)
    const sortedTasks = [...tasks].sort((a, b) => 
      new Date(b.workin) - new Date(a.workin)
    ).slice(0, 5);
    setRecentTasks(sortedTasks);
  };
  
  // Process workers data
  const processWorkersData = (staff, attendanceHistory) => {
    // Today's date in ISO format
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate daily totals for attendance
    const dailyTotals = {};
    Object.entries(attendanceHistory).forEach(([date, records]) => {
      dailyTotals[date] = Object.values(records).filter(isPresent => isPresent).length;
    });
    
    // Count present and absent workers today
    const presentToday = dailyTotals[today] || 0;
    const absentToday = staff.length - presentToday;
    setWorkerStats({ present: presentToday, absent: absentToday });
    
    // Calculate attendance trend for the last 7 days
    const today_date = new Date();
    const lastWeekDates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today_date);
      date.setDate(today_date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      lastWeekDates.push(formattedDate);
    }
    
    const trend = lastWeekDates.map(date => ({
      date,
      present: dailyTotals[date] || 0,
      absent: (staff.length - (dailyTotals[date] || 0))
    }));
    
    setAttendanceTrend(trend);
    
    // Get most consistent workers
    const workerAttendance = {};
    
    // Initialize attendance count for each worker
    staff.forEach(worker => {
      workerAttendance[worker.staffId] = {
        name: worker.name,
        presentDays: 0,
        totalDays: 0,
        rate: 0
      };
    });
    
    // Count attendance for each worker
    Object.entries(attendanceHistory).forEach(([date, records]) => {
      Object.entries(records).forEach(([staffId, isPresent]) => {
        if (workerAttendance[staffId]) {
          workerAttendance[staffId].totalDays++;
          if (isPresent) workerAttendance[staffId].presentDays++;
        }
      });
    });
    
    // Calculate attendance rate
    Object.values(workerAttendance).forEach(worker => {
      worker.rate = worker.totalDays > 0 
        ? (worker.presentDays / worker.totalDays) * 100 
        : 0;
    });
    
    // Sort by attendance rate and get top 3
    const topWorkers = Object.values(workerAttendance)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3);
      
    setConsistentWorkers(topWorkers);
  };
  
  // Process location data
  const processLocationData = (tasks, staff) => {
    // Get unique locations from tasks
    const uniqueLocations = [...new Set(tasks.map(task => task.location))].filter(Boolean);
    setLocations(uniqueLocations);
    
    // Create mapping of staff to locations based on tasks
    const staffData = {};
    uniqueLocations.forEach(location => {
      // Get all tasks for this location
      const locationTasks = tasks.filter(task => task.location === location);
      
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
    
    setStaffByLocation(staffData);
  };

  // Helper function for status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Chart data for tasks
  const taskDoughnutData = {
    labels: ['Completed', 'In Progress', 'Delayed'],
    datasets: [
      {
        label: 'Tasks',
        data: [taskStats.completed, taskStats.inProgress, taskStats.delayed],
        backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
        borderColor: ['#22c55e', '#3b82f6', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };
  
  const taskDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: { size: 12 }
        }
      }
    }
  };
  
  // Chart data for workers
  const workerDoughnutData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Attendance',
        data: [workerStats.present, workerStats.absent],
        backgroundColor: ['#86ff8d', '#ff8686'],
        borderColor: ['#86ff8d', '#ff8686'],
        borderWidth: 1,
      },
    ],
  };
  
  const workerDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: { size: 12 }
        }
      }
    }
  };
  
  // Chart data for locations
  const locationBarData = {
    labels: Object.keys(tasksByLocation).slice(0, 5),
    datasets: [
      {
        label: 'Tasks',
        data: Object.values(tasksByLocation).slice(0, 5),
        backgroundColor: '#3B82F6',
        borderColor: '#1F2937',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };
  
  const locationBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };
  
  // Attendance trend chart
  const attendanceTrendData = {
    labels: attendanceTrend.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Present',
        data: attendanceTrend.map(day => day.present),
        backgroundColor: '#86ff8d',
        borderRadius: 6,
        barPercentage: 0.6,
      }
    ],
  };
  
  const attendanceTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
        <div className="flex justify-center items-center h-64 mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
          
        </div>
        
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-500">Total Tasks</div>
              <div className="text-2xl font-bold">
                {taskStats.completed + taskStats.inProgress + taskStats.delayed}
              </div>
            </div>
            <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {taskStats.completed} completed, {taskStats.inProgress} in progress
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-500">Attendance</div>
              <div className="text-2xl font-bold">{workerStats.present}</div>
            </div>
            <div className="text-green-500 bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {workerStats.absent} workers absent today
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-500">Locations</div>
              <div className="text-2xl font-bold">{locations.length}</div>
            </div>
            <div className="text-yellow-500 bg-yellow-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Top: {topLocation.name} ({topLocation.count} tasks)
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-500">Delayed Tasks</div>
              <div className="text-2xl font-bold">{taskStats.delayed}</div>
            </div>
            <div className="text-red-500 bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Requires immediate attention
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Task Status Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Status</h3>
          <div className="h-64">
            <Doughnut data={taskDoughnutData} options={taskDoughnutOptions} />
          </div>
        </div>

        {/* Worker Attendance Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Attendance</h3>
          <div className="h-64">
            <Doughnut data={workerDoughnutData} options={workerDoughnutOptions} />
          </div>
        </div>

        {/* Top Locations Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Locations</h3>
          <div className="h-64">
            <Bar data={locationBarData} options={locationBarOptions} />
          </div>
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Tasks */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
            <Link to="/tasks" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{task.nature || task.taskid}</td>
                    <td className="px-3 py-2">{task.location}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500">
                      {new Date(task.workin).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentTasks.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-3 py-3 text-center text-sm text-gray-500">
                      No recent tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Combined Insights */}
        <div className="grid grid-cols-1 gap-6">
          {/* Worker Attendance Trend */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Attendance</h3>
            <div className="h-40">
              <Bar data={attendanceTrendData} options={attendanceTrendOptions} />
            </div>
          </div>

          {/* Top Consistent Workers */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Most Consistent Workers</h3>
              <Link to="/attendance" className="text-blue-600 text-sm hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {consistentWorkers.map((worker, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                      {worker.name.charAt(0)}
                    </div>
                    <span className="ml-2 font-medium">{worker.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{worker.rate.toFixed(1)}%</span> attendance
                  </div>
                </div>
              ))}
              {consistentWorkers.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-3">
                  No attendance data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attention Required</h3>
        <div className="space-y-3">
          {taskStats.delayed > 0 && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">You have {taskStats.delayed} delayed tasks that require attention</p>
                <Link to="/tasks" className="text-sm text-red-800 hover:underline">View delayed tasks</Link>
              </div>
            </div>
          )}
          
          {workerStats.absent > 0 && (
            <div className="p-3 bg-amber-50 text-amber-700 rounded-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">{workerStats.absent} workers are absent today</p>
                <Link to="/attendance" className="text-sm text-amber-800 hover:underline">View attendance details</Link>
              </div>
            </div>
          )}
          
          {taskStats.delayed === 0 && workerStats.absent === 0 && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">All systems running smoothly. No immediate attention required.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
