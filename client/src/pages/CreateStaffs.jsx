import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const BASE_URL = "https://work-status-portal-backend.vercel.app/api/staff";

export const CreateStaffs = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState('');

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

  const validateForm = () => {
    const newErrors = {};
    if (!newStaff.name) newErrors.name = 'Name is required';
    if (!newStaff.email) newErrors.email = 'Email is required';
    if (!newStaff.phone) newErrors.phone = 'Phone is required';
    if (!newStaff.staffId) newErrors.staffId = 'Staff ID is required';
    if (!newStaff.designation) newErrors.designation = 'Designation is required';
    if (!newStaff.status) newErrors.status = 'Status is required';
    if (!newStaff.skill) newErrors.skill = 'Skill is required';
    if (newStaff.skill === 'Others' && !newStaff.otherSkill) {
      newErrors.otherSkill = 'Please specify the skill';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'skill' && value !== 'Others' ? { otherSkill: '' } : {})
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      navigate('/staffs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setNotification('Please correct the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(BASE_URL, newStaff);
      setNotification('Staff created successfully!');
      setTimeout(() => {
        navigate('/staffs');
      }, 1500);
    } catch (error) {
      console.error('Error creating staff:', error);
      setNotification(error.response?.data?.message || 'Failed to create staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/staffs')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Create New Staff</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name and Email fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name:
                <input
                  type="text"
                  name="name"
                  value={newStaff.name}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.name ? 'border-red-500' : ''}`}
                />
              </label>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
                <input
                  type="email"
                  name="email"
                  value={newStaff.email}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.email ? 'border-red-500' : ''}`}
                />
              </label>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone and Staff ID fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={newStaff.phone}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
                />
              </label>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Staff ID:
                <input
                  type="text"
                  name="staffId"
                  value={newStaff.staffId}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.staffId ? 'border-red-500' : ''}`}
                />
              </label>
              {errors.staffId && <p className="text-red-500 text-sm mt-1">{errors.staffId}</p>}
            </div>

            {/* Designation and Status fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Designation:
                <select
                  name="designation"
                  value={newStaff.designation}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.designation ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Designation</option>
                  <option value="Staff">Staff</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </label>
              {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status:
                <select
                  name="status"
                  value={newStaff.status}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.status ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            {/* Skill fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skill:
                <select
                  name="skill"
                  value={newStaff.skill}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${errors.skill ? 'border-red-500' : ''}`}
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
              {errors.skill && <p className="text-red-500 text-sm mt-1">{errors.skill}</p>}
            </div>

            {newStaff.skill === "Others" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Other Skill:
                  <input
                    type="text"
                    name="otherSkill"
                    value={newStaff.otherSkill}
                    onChange={handleInputChange}
                    className={`mt-1 p-2 w-full border rounded-md ${errors.otherSkill ? 'border-red-500' : ''}`}
                  />
                </label>
                {errors.otherSkill && <p className="text-red-500 text-sm mt-1">{errors.otherSkill}</p>}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
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
                'Create Staff'
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

export default CreateStaffs;
