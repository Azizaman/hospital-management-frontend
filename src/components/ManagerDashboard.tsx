import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
      <p className="mb-6">Welcome, Manager! Here you can manage all hospital operations.</p>
      
      <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:flex-wrap sm:justify-start">
        <button
          onClick={() => navigate('/manage-patients')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          Manage Patients
        </button>
        <button
          onClick={() => navigate('/manage-diet-charts')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          Manage Diet Charts
        </button>
        <button
          onClick={() => navigate('/view-pantry-stocks')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          View Pantry Stocks
        </button>

        <button
          onClick={() => navigate('/pantrylist')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          Pantry List
        </button>

        <button
          onClick={() => navigate('/track-meals')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          Track Meal Preparation
        </button>

        <button
          onClick={() => navigate('/view-deliveries')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          View Deliveries
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-700 w-full sm:w-auto"
      >
        Logout
      </button>
    </div>
  );
};

export default ManagerDashboard;
