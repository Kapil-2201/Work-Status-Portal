import { useState, useEffect } from "react";
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/`;



// Updated Workers Section with attendance data from /api/attendance/history
const WorkersSection = () => {
  const [workers, setWorkers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [dailyTotals, setDailyTotals] = useState({});
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workersResponse, attendanceResponse] = await Promise.all([
          axios.get(`${BASE_URL}staff`),
          axios.get(`${BASE_URL}attendance/history`)
        ]);
        
        setWorkers(workersResponse.data);
        
        const attendanceHistory = attendanceResponse.data.attendance || attendanceResponse.data;
        setAttendanceData(attendanceHistory);
        
        // Calculate daily totals
        const totals = {};
        Object.entries(attendanceHistory).forEach(([date, records]) => {
          totals[date] = Object.values(records).filter(isPresent => isPresent).length;
        });
        setDailyTotals(totals);
        
        // Calculate attendance trend for the last 7 days
        const today = new Date();
        const lastWeekDates = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const formattedDate = date.toISOString().split('T')[0];
          lastWeekDates.push(formattedDate);
        }
        
        const trend = lastWeekDates.map(date => ({
          date,
          present: totals[date] || 0,
          absent: (workers.length - (totals[date] || 0))
        }));
        
        setAttendanceTrend(trend);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get today's date in ISO format
  const today = new Date().toISOString().split('T')[0];
  
  // Count present and absent workers today
  const presentToday = dailyTotals[today] || 0;
  const absentToday = workers.length - presentToday;
  
  // Calculate overall attendance rate
  const calculateAttendanceRate = () => {
    const dates = Object.keys(dailyTotals);
    if (dates.length === 0) return 0;
    
    const totalPresentCount = Object.values(dailyTotals).reduce((sum, count) => sum + count, 0);
    const totalPossibleAttendance = dates.length * workers.length;
    
    return totalPossibleAttendance > 0 
      ? ((totalPresentCount / totalPossibleAttendance) * 100).toFixed(1) 
      : 0;
  };

  // List of workers present today
  const presentWorkers = workers.filter(worker => {
    const todayAttendance = attendanceData[today] || {};
    return todayAttendance[worker.staffId] === true;
  });
  
  // Most consistent workers (highest attendance rate)
  const getConsistentWorkers = () => {
    const workerAttendance = {};
    
    // Initialize attendance count for each worker
    workers.forEach(worker => {
      workerAttendance[worker.staffId] = {
        name: worker.name,
        presentDays: 0,
        totalDays: 0,
        rate: 0
      };
    });
    
    // Count attendance for each worker
    Object.entries(attendanceData).forEach(([date, records]) => {
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
    
    // Sort by attendance rate and return top 5
    return Object.values(workerAttendance)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);
  };
  
  const consistentWorkers = getConsistentWorkers();
  
  // Chart data for today's attendance
  const attendanceChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [presentToday, absentToday],
        backgroundColor: ['#86ff8d', '#ff8686'],
        borderColor: ['#86ff8d', '#ff8686'],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  // Weekly attendance data for trend chart
  const trendChartData = {
    labels: attendanceTrend.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Present',
        data: attendanceTrend.map(day => day.present),
        backgroundColor: '#86ff8d',
      },
      {
        label: 'Absent',
        data: attendanceTrend.map(day => day.absent),
        backgroundColor: '#ff8686',
      },
    ],
  };
  
  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Workers</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Workers</h2>
      <p className="text-gray-700 mb-6">Manage and monitor your workforce.</p>
      
      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Today's Attendance */}
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Today's Attendance</h3>
          <div className="flex items-center">
            <div className="w-1/2 h-40">
              <Doughnut data={attendanceChartData} options={chartOptions} />
            </div>
            <div className="w-1/2 pl-4">
              <p className="text-gray-700 mb-1">
                <span className="font-semibold text-green-600">{presentToday}</span> Present
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold text-red-600">{absentToday}</span> Absent
              </p>
              <p className="text-gray-700 mt-3">
                Overall attendance rate: <span className="font-semibold">{calculateAttendanceRate()}%</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Active Workers Summary */}
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Active Workers</h3>
          <p className="text-gray-700 mb-2">
            Total Workers: <span className="font-semibold">{workers.length}</span>
          </p>
          <p className="text-gray-700 mb-4">
            Active: <span className="font-semibold">{workers.filter(w => w.status === 'Active').length}</span>
          </p>
          <h4 className="font-medium text-gray-800 mb-1">Today's Team:</h4>
          <ul className="max-h-24 overflow-y-auto text-gray-700">
            {presentWorkers.slice(0, 5).map(worker => (
              <li key={worker.staffId} className="mb-1">
                {worker.name}
              </li>
            ))}
            {presentWorkers.length > 5 && 
              <li className="text-blue-600">+ {presentWorkers.length - 5} more</li>
            }
          </ul>
        </div>
        
        {/* Top Performers */}
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Most Consistent</h3>
          <ul className="text-gray-700">
            {consistentWorkers.map((worker, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{worker.name}</span>
                <span className="font-medium">{worker.rate.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Weekly Attendance Trend */}
      <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Attendance</h3>
        <div className="h-64">
          <Bar data={trendChartData} options={trendChartOptions} />
        </div>
      </div>
      
      {/* Present Workers List */}
      <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Workers Present Today</h3>
        <p className="text-gray-700 mb-4">
          There are currently {presentWorkers.length} workers present today.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {presentWorkers.map(worker => (
            <div key={worker.staffId} className="bg-white p-2 rounded shadow">
              <div className="font-medium">{worker.name}</div>
              <div className="text-sm text-gray-600">{worker.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkersSection;
