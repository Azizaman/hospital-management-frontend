import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Stock {
  id: number;
  item: string;
  quantity: string;
}

const ManagerPantry: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://hospital-management-backend-zlyb.onrender.com/pantry', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response:', response.data);

        // Ensure response is properly formatted
        if (response.data && Array.isArray(response.data.pantry)) {
          setStocks(response.data.pantry);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching pantry stocks:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch pantry stocks');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Pantry Stocks</h1>
      {stocks && stocks.length > 0 ? (
        <ul>
          {stocks.map((stock) => (
            <li key={stock.id} className="mb-2">
              {stock.item} - {stock.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <div>No stocks available</div>
      )}
    </div>
  );
};

export default ManagerPantry;
