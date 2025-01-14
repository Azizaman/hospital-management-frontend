import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the type for a patient
interface Patient {
  id: number;
  name: string;
  disease: string;
  roomNumber: number;
}

const ManagerPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://hospital-management-backend-zlyb.onrender.com/patient', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if response data is an array
        if (Array.isArray(response.data)) {
          setPatients(response.data); // Assign the array directly
        } else {
          setError('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
      <h2 className="text-2xl mb-4">Patient List</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id} className="mb-2">
            <span className="font-semibold">{patient.name}</span> - Room: {patient.roomNumber} - Disease: {patient.disease}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerPatients;
