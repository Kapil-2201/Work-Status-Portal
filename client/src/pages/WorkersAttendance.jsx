import { useState, useEffect } from 'react';
import axios from 'axios';
const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const WorkersAttendance = () => {
  const [staff, setStaff] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [dailyTotals, setDailyTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedMonth(today.substring(0, 7));
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, attendanceRes] = await Promise.all([
        axios.get(`${BASE_URL}/staff`),
        axios.get(`${BASE_URL}/attendance/history`)
      ]);

      const staffData = staffRes.data;
      const attendanceHistory = attendanceRes.data;

      const formattedAttendance = {};
      Object.entries(attendanceHistory.attendance).forEach(([date, records]) => {
        formattedAttendance[date] = {};
        Object.entries(records).forEach(([staffId, isPresent]) => {
          formattedAttendance[date][staffId] = isPresent ? 'PR' : 'AB';
        });
      });

      setStaff(staffData);
      setAttendanceData(formattedAttendance);

      const totals = {};
      Object.entries(formattedAttendance).forEach(([date, records]) => {
        totals[date] = Object.values(records).filter(status => status === 'PR').length;
      });
      setDailyTotals(totals);
    } catch (err) {
      setNotification("Failed to fetch attendance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (staffId, date, status) => {
    const today = new Date().toISOString().split('T')[0];
    if (date !== today) return;

    try {
      setNotification("Updating attendance...");
      const currentDayAttendance = attendanceData[date] || {};
      const isPresent = status === 'PR';

      if (status !== 'Unmarked') {
        const response = await axios.post(`${BASE_URL}/attendance/history`, {
          date,
          staffId,
          isPresent,
          totalPresent: Object.values({
            ...currentDayAttendance,
            [staffId]: status
          }).filter(s => s === 'PR').length
        });
      }

      const updatedAttendance = {
        ...attendanceData,
        [date]: {
          ...currentDayAttendance,
          [staffId]: status
        }
      };

      setAttendanceData(updatedAttendance);
      setDailyTotals(prev => ({
        ...prev,
        [date]: Object.values(updatedAttendance[date]).filter(s => s === 'PR').length
      }));

      setNotification("Attendance updated successfully");
      setTimeout(() => setNotification(""), 2000);
    } catch (err) {
      setNotification("Failed to update attendance");
      console.error(err);
      await fetchData();
    }
  };

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysInMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const startDate = new Date(year, month - 1, 1); // First day of month
    const endDate = new Date(year, month, 0);       // Last day of month
    const days = [];
    
    // Get all days in the month
    for (let date = 1; date <= endDate.getDate(); date++) {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      days.push(formattedDate);
    }
    
    return days;
  };

  const daysInMonth = getDaysInMonth(selectedMonth);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${
            notification.includes('success') 
              ? 'bg-green-100 text-green-800' 
              : notification.includes('Updating')
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {notification}
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Daily Attendance</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded-lg px-4 py-2 shadow-sm"
        />
      </div>

      <div className="mb-4">
        <input
          type="search"
          className="w-full p-3 border rounded-lg shadow-sm"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    Staff Name
                  </th>
                  {daysInMonth.map(date => {
                    const dayDate = new Date(date);
                    const dayNum = dayDate.getDate();
                    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
                    return (
                      <th key={date} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div>{dayNum}</div>
                        <div className="text-gray-400">{dayName}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map(staffMember => (
                  <tr key={staffMember.staffId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                      {staffMember.name}
                    </td>
                    {daysInMonth.map(date => {
                      const status = attendanceData[date]?.[staffMember.staffId] || 'Unmarked';
                      return (
                        <td key={date} className="px-6 py-4 text-center">
                          <select
                            value={status}
                            onChange={(e) => handleAttendanceChange(staffMember.staffId, date, e.target.value)}
                            disabled={date !== today}
                            className={`text-sm border rounded-lg px-3 py-1 ${
                              status === 'PR' 
                                ? 'bg-green-100 text-green-800' 
                                : status === 'AB' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-600'
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                          >
                            <option value=" "> </option>
                            <option value="PR">PR</option>
                            <option value="AB">AB</option>
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-gray-50 z-10">
                    Total Present
                  </td>
                  {daysInMonth.map(date => (
                    <td key={date} className="px-6 py-4 text-center">
                      {dailyTotals[date] || 0}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersAttendance;