import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TasksSection = () => {
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({ completed: 0, delayed: 0, inProgress: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskTypes, setTaskTypes] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5173/api/task');
        const tasksData = response.data || [];
        setTasks(tasksData);
        
        // Calculate task statistics
        const completed = tasksData.filter(task => task.status === 'Completed').length;
        const delayed = tasksData.filter(task => task.status === 'Delayed').length;
        const inProgress = tasksData.filter(task => task.status === 'In Progress').length;
        setTaskStats({ completed, delayed, inProgress });
        
        // Get recent tasks (latest 5)
        const sortedTasks = [...tasksData].sort((a, b) => {
          // Sort by work in date if available, otherwise use _id as fallback
          const dateA = a.workin ? new Date(a.workin) : 0;
          const dateB = b.workin ? new Date(b.workin) : 0;
          return dateB - dateA;
        });
        setRecentTasks(sortedTasks.slice(0, 5));
        
        // Analyze task types
        const types = {};
        tasksData.forEach(task => {
          const nature = task.nature || 'Unspecified';
          types[nature] = (types[nature] || 0) + 1;
        });
        setTaskTypes(types);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart data for task distribution by status
  const taskDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 12
          }
        }
      }
    }
  };

  const taskDoughnutData = {
    labels: ['Completed', 'Delayed', 'In Progress'],
    datasets: [
      {
        label: '# of Tasks',
        data: [taskStats.completed, taskStats.delayed, taskStats.inProgress],
        backgroundColor: ['#22c55e', '#ef4444', '#3b82f6'],
        borderColor: ['#22c55e', '#ef4444', '#3b82f6'],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for task types (nature of work) - MODIFIED to match WorkersSection style
  const taskTypeLabels = Object.keys(taskTypes).slice(0, 7); // Limit to 7 types
  const taskTypeData = taskTypeLabels.map(label => taskTypes[label]);
  
  const taskTypeBarData = {
    labels: taskTypeLabels,
    datasets: [
      {
        label: 'Number of Tasks',
        data: taskTypeData,
        backgroundColor: '#86ff8d',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };
  
  const taskTypeBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} task(s)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        stacked: false
      },
      x: {
        stacked: false,
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tasks</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Tasks</h2>
          <p className="text-gray-700">Manage and track your task progress.</p>
        </div>
        <Link 
          to="/tasks" 
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          View All Tasks
        </Link>
      </div>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Task Status Chart */}
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Status</h3>
          <div className="h-52">
            <Doughnut data={taskDoughnutData} options={taskDoughnutOptions} />
          </div>
        </div>
        
        {/* Task Summary */}
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Summary</h3>
          <div className="flex flex-col justify-center h-52">
            <div className="mb-3">
              <p className="text-gray-700">
                Total Tasks: <span className="font-semibold">{tasks.length}</span>
              </p>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <p className="text-gray-700">
                Completed: <span className="font-semibold">{taskStats.completed}</span>
                {tasks.length > 0 && (
                  <span className="text-sm text-gray-500 ml-1">
                    ({Math.round(taskStats.completed / tasks.length * 100)}%)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <p className="text-gray-700">
                In Progress: <span className="font-semibold">{taskStats.inProgress}</span>
                {tasks.length > 0 && (
                  <span className="text-sm text-gray-500 ml-1">
                    ({Math.round(taskStats.inProgress / tasks.length * 100)}%)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <p className="text-gray-700">
                Delayed: <span className="font-semibold">{taskStats.delayed}</span>
                {tasks.length > 0 && (
                  <span className="text-sm text-gray-500 ml-1">
                    ({Math.round(taskStats.delayed / tasks.length * 100)}%)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Task Priorities */}
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Attention</h3>
          <div className="h-52 overflow-y-auto">
            {tasks.filter(task => task.status === 'Delayed').slice(0, 5).map(task => (
              <div key={task._id} className="mb-3 p-2 bg-white rounded shadow-sm">
                <div className="font-medium text-gray-800">{task.nature}</div>
                <div className="text-sm text-gray-600">Location: {task.location}</div>
                <div className="mt-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
            {tasks.filter(task => task.status === 'Delayed').length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500">
                No delayed tasks
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Task Types Chart - MODIFIED to match WorkersSection style */}
      <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Types</h3>
        <div className="h-64">
          <Bar data={taskTypeBarData} options={taskTypeBarOptions} />
        </div>
      </div>
      
      {/* Recent Tasks */}
      <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Recent Tasks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nature</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{task.taskid}</td>
                  <td className="px-4 py-2">{task.nature}</td>
                  <td className="px-4 py-2">{task.location}</td>
                  <td className="px-4 py-2">{task.number}</td>
                  <td className="px-4 py-2">
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
    </div>
  );
};

export default TasksSection;