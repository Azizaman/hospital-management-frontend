import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPantryStocks: React.FC = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://hospital-management-backend-zlyb.onrender.com/pantry', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStocks(response.data.pantry);
      } catch (error) {
        console.error('Error fetching pantry stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Pantry Stocks</h1>
      <ul>
        {stocks.map((stock: any) => (
          <li key={stock.id} className="mb-2">
            {stock.item} - {stock.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewPantryStocks;
