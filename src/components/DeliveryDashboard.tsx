import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Delivery Dashboard</h1>
      <p className="mb-6">Welcome, Delivery Staff! Here you can track meal deliveries and routes.</p>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/view-deliveries')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          View Deliveries
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

export default DeliveryDashboard;
