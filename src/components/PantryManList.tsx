import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableRow, TableCell, TableHeader, TableBody, TableHead } from "@/components/ui"; // Assuming these are being imported

const PantryManList: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<any[]>([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState({ staffName: '', contactInfo: '', location: '' });
  const token = localStorage.getItem('token');

  // Fetch pantry items
  const fetchPantryItems = async () => {
    try {
      const response = await axios.get('https://hospital-management-backend-zlyb.onrender.com/pantry', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setPantryItems(response.data.pantry);
      } else {
        console.error("Error fetching pantry items:", response.data.error);
      }
    } catch (error) {
      console.error('Error fetching pantry items:', error);
    }
  };

  useEffect(() => {
    fetchPantryItems();
  }, []);

  const handleAddItem = async () => {
    try {
      const { staffName, contactInfo, location } = newItem;

      // Validate required fields
      if (!staffName || !contactInfo || !location) {
        alert('Please fill in all required fields');
        return;
      }

      // Send POST request to add new pantry user
      await axios.post(
        'https://hospital-management-backend-zlyb.onrender.com/pantry',  // Correct endpoint for pantry users
        { staffName, contactInfo, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPantryItems();  // Refresh pantry list
      setNewItem({ staffName: '', contactInfo: '', location: '' });  // Reset form fields
      setShowAddItemForm(false);  // Hide form after submission
    } catch (error) {
      console.error('Error adding pantry user:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await axios.delete(`https://hospital-management-backend-zlyb.onrender.com/pantry/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPantryItems();  // Refresh pantry list after deletion
    } catch (error) {
      console.error('Error deleting pantry user:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Pantry Dashboard</h1>
      <p className="mb-6">Welcome, Pantry Staff! Here you can manage food preparation and pantry details.</p>

      {/* Add User Form */}
      {showAddItemForm ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Staff Name"
            value={newItem.staffName}
            onChange={(e) => setNewItem({ ...newItem, staffName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Contact Info"
            value={newItem.contactInfo}
            onChange={(e) => setNewItem({ ...newItem, contactInfo: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={newItem.location}
            onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
            className="p-2 border rounded"
          />
          <div>
            <Button onClick={handleAddItem} className="mt-2 bg-black text-white rounded hover:bg-gray-700">
              Add User
            </Button>
            <Button
              onClick={() => setShowAddItemForm(false)}
              className="mt-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setShowAddItemForm(true)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Add New Pantry Staff
        </Button>
      )}

      {/* Pantry Stocks Table */}
      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pantryItems.length > 0 ? (
              pantryItems.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.staffName}</TableCell>
                  <TableCell>{item.contactInfo}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No pantry staff available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PantryManList;
