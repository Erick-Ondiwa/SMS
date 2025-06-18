import { useState } from 'react';
import RegisterForm from './RegisterForm';
import axios from 'axios';

const AdminAddStudent = () => {
  const [step, setStep] = useState(1); // Step 1 = Register User, Step 2 = Add Student Details
  const [userId, setUserId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState({
    admissionNumber: '',
    dateOfBirth: '',
    address: '',
    gender: '',
    phoneNumber: '',
    photoUrl: '',
    parentId: ''
  });

  const handleRegisterComplete = (uid, sid) => {
    setUserId(uid);
    setStudentId(sid);
    setStep(2);
  };

  const handleChange = (e) => {
    setStudentData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitStudentDetails = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Must be admin's token
      const payload = {
        ...studentData,
        userId: userId,
        phoneNumber: studentData.phoneNumber || '',
        dateOfBirth: studentData.dateOfBirth || '2000-01-01', // fallback for now
      };

      await axios.put(`https://localhost:7009/api/students/${studentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Student registered and updated successfully!');
      setStep(1); // Reset back to step 1
      setUserId('');
      setStudentId('');
      setStudentData({});
    } catch (err) {
      console.error(err);
      alert('Failed to update student details.');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {step === 1 && (
        <RegisterForm
          isAdminCreating={true}
          onRegisterComplete={handleRegisterComplete}
        />
      )}

      {step === 2 && (
        <form onSubmit={handleSubmitStudentDetails} className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Complete Student Details</h2>

          <input
            type="text"
            name="admissionNumber"
            placeholder="Admission Number"
            value={studentData.admissionNumber}
            onChange={handleChange}
            required
            className="block w-full mb-3 border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="date"
            name="dateOfBirth"
            value={studentData.dateOfBirth}
            onChange={handleChange}
            className="block w-full mb-3 border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={studentData.address}
            onChange={handleChange}
            className="block w-full mb-3 border border-gray-300 rounded px-3 py-2"
          />

          <select
            name="gender"
            value={studentData.gender}
            onChange={handleChange}
            className="block w-full mb-3 border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={studentData.phoneNumber}
            onChange={handleChange}
            className="block w-full mb-3 border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="text"
            name="photoUrl"
            placeholder="Photo URL"
            value={studentData.photoUrl}
            onChange={handleChange}
            className="block w-full mb-3 border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="text"
            name="parentId"
            placeholder="Parent ID (optional)"
            value={studentData.parentId}
            onChange={handleChange}
            className="block w-full mb-4 border border-gray-300 rounded px-3 py-2"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Student Details
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminAddStudent;
