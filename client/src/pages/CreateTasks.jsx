import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/task`;


export const CreateTasks = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const initialTaskState = {
    taskid: '',
    nature: '',
    location: '',
    number: 1,
    staffNames: [''],
    workin: '',
    workout: '',
    status: '',
    reasonForDelay: '',
    remarks: ''
  };

  const [newTask, setNewTask] = useState(initialTaskState);
  const [notification, setNotification] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!newTask.taskid) newErrors.taskid = 'Task ID is required';
    if (!newTask.nature) newErrors.nature = 'Nature of work is required';
    if (!newTask.location) newErrors.location = 'Location is required';
    if (!newTask.workin) newErrors.workin = 'Work in time is required';
    if (!newTask.workout) newErrors.workout = 'Work out time is required';
    if (!newTask.status) newErrors.status = 'Status is required';
    if (newTask.status === 'Delayed' && !newTask.reasonForDelay) {
      newErrors.reasonForDelay = 'Reason for delay is required';
    }
    if (newTask.staffNames.some(name => !name.trim())) {
      newErrors.staffNames = 'All staff names must be filled';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberOfStaffChange = (e) => {
    const value = parseInt(e.target.value);
    setNewTask(prev => ({
      ...prev,
      number: value,
      staffNames: Array(value).fill('').map((_, i) => prev.staffNames[i] || '')
    }));
  };

  const handleStaffNameChange = (index, e) => {
    const newStaffNames = [...newTask.staffNames];
    newStaffNames[index] = e.target.value;
    setNewTask(prev => ({
      ...prev,
      staffNames: newStaffNames
    }));
    if (errors.staffNames) {
      setErrors(prev => ({ ...prev, staffNames: '' }));
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      navigate('/tasks');
    }
  };

  const handleAddTask = async () => {
    if (!validateForm()) {
      setNotification('Please correct the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(BASE_URL, newTask);
      setNotification('Task created successfully!');
      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    } catch (error) {
      console.error('Error creating task:', error);
      setNotification(error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/tasks')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Create New Task</h1>
        </div>




        <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task Id:
                <input
                  type="text"
                  name="taskid"
                  value={newTask.taskid}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.taskid ? 'border-red-500' : ''}`}
                  required
                />
              </label>
              {errors.taskid && <p className="text-red-500 text-sm mt-1">{errors.taskid}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nature of Work:
                <input
                  type="text"
                  name="nature"
                  value={newTask.nature}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.nature ? 'border-red-500' : ''}`}
                  required
                />
              </label>
              {errors.nature && <p className="text-red-500 text-sm mt-1">{errors.nature}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location:
                <input
                  type="text"
                  name="location"
                  value={newTask.location}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.location ? 'border-red-500' : ''}`}
                  required
                />
              </label>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Staff:
                <input
                  type="number"
                  name="number"
                  value={newTask.number}
                  min="1"
                  max="10"
                  onChange={handleNumberOfStaffChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newTask.staffNames.map((name, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">
                  Staff Name {index + 1}:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleStaffNameChange(index, e)}
                    className={`mt-1 p-2 w-full border rounded-md ${errors.staffNames ? 'border-red-500' : ''}`}
                    required
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work In Time:
                <input
                  type="datetime-local"
                  name="workin"
                  value={newTask.workin}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.workin ? 'border-red-500' : ''}`}
                  required
                />
              </label>
              {errors.workin && <p className="text-red-500 text-sm mt-1">{errors.workin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Out Time:
                <input
                  type="datetime-local"
                  name="workout"
                  value={newTask.workout}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.workout ? 'border-red-500' : ''}`}
                  required
                />
              </label>
              {errors.workout && <p className="text-red-500 text-sm mt-1">{errors.workout}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status:
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className={`mt-1 p-2 w-full border rounded-md ${errors.status ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
            </label>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          {newTask.status === "Delayed" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason for Delay:
                <input
                  type="text"
                  name="reasonForDelay"
                  value={newTask.reasonForDelay}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.reasonForDelay ? 'border-red-500' : ''}`}
                  required
                />
              </label>
              {errors.reasonForDelay && <p className="text-red-500 text-sm mt-1">{errors.reasonForDelay}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Remarks:
              <textarea
                name="remarks"
                value={newTask.remarks}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md h-24"
              />
            </label>
          </div>

          <div className="flex justify-end gap-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>

        {notification && (
          <div className={`mt-4 p-4 rounded-md ${
            notification.includes('success') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {notification}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default CreateTasks;