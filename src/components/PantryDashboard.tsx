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
      <div className="space-x-4">



      <button
          onClick={() => navigate('/pantrylist')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Pantry List
        </button>
        
        
        <button
          onClick={() => navigate('/view-pantry-stocks')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          View Pantry Stocks
        </button>
        <button
          onClick={() => navigate('/track-meals')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Track Meal Preparation
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
      >
        Logout
      </button>
    </div>
  );
};

export default ManagerDashboard;
