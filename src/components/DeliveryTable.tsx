import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
  TableHead,
  Button,
  Input,
} from "@/components/ui";





const DeliveryDashboard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [foodCharts, setFoodCharts] = useState<any[]>([]);
  const [newDelivery, setNewDelivery] = useState({
    foodChartId: 0,
    status: "pending",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchFoodCharts = async () => {
    try {
      const response = await axios.get("https://hospital-management-backend-zlyb.onrender.com/food-chart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setFoodCharts(response.data.foodchart);
      } else {
        console.error("Failed to fetch food charts:", response.data);
      }
    } catch (error) {
      console.error("Error fetching food charts:", error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get("https://hospital-management-backend-zlyb.onrender.com/meal-delivery", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setDeliveries(response.data.mealDeliveries);
      } else {
        console.error("Failed to fetch deliveries:", response.data);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  const handleAddDelivery = async () => {
    if (!newDelivery.foodChartId || !newDelivery.status) {
      alert("Food Chart ID and Status are required.");
      return;
    }
    try {
      const response = await axios.post(
        "https://hospital-management-backend-zlyb.onrender.com/meal-delivery",
        newDelivery,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setNewDelivery({ foodChartId: 0, status: "pending", notes: "" });
        await fetchDeliveries();
      }
    } catch (error) {
      console.error("Error adding new delivery:", error);
    }
  };

  const handleUpdateDelivery = async (id: number, status: string) => {
    try {
      const response = await axios.put(
        `https://hospital-management-backend-zlyb.onrender.com/meal-delivery/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        await fetchDeliveries();
      }
    } catch (error) {
      console.error("Error updating delivery:", error);
    }
  };

  const handleDeleteDelivery = async (id: number) => {
    try {
      const response = await axios.delete(
        `https://hospital-management-backend-zlyb.onrender.com/meal-delivery/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        await fetchDeliveries();
      }
    } catch (error) {
      console.error("Error deleting delivery:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFoodCharts(), fetchDeliveries()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;


  

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Delivery Dashboard</h1>

      {/* Food Chart Table */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Food Chart</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Morning Meal</TableHead>
              <TableHead>Evening Meal</TableHead>
              <TableHead>Night Meal</TableHead>
              <TableHead>Instructions</TableHead>
              <TableHead>Ingredients</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodCharts.map((chart) => (
              <TableRow key={chart.id}>
                <TableCell>{chart.id}</TableCell>
                <TableCell>{chart.patientId}</TableCell>
                <TableCell>{chart.morningMeal}</TableCell>
                <TableCell>{chart.eveningMeal}</TableCell>
                <TableCell>{chart.nightMeal}</TableCell>
                <TableCell>{chart.instructions}</TableCell>
                <TableCell>{chart.ingredients}</TableCell>
                <TableCell>{new Date(chart.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Add Delivery */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Delivery</h2>
        <div className="flex gap-4">
          <select
            value={newDelivery.foodChartId}
            onChange={(e) => setNewDelivery({ ...newDelivery, foodChartId: Number(e.target.value) })}
          >
            <option value={0}>Select Food Chart</option>
            {foodCharts.map((chart) => (
              <option key={chart.id} value={chart.id}>
                {`Food Chart #${chart.id}`}
              </option>
            ))}
          </select>
          <select
            value={newDelivery.status}
            onChange={(e) => setNewDelivery({ ...newDelivery, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <Input
            type="text"
            placeholder="Notes"
            value={newDelivery.notes}
            onChange={(e) => setNewDelivery({ ...newDelivery, notes: e.target.value })}
          />
          <Button onClick={handleAddDelivery}>Add Delivery</Button>
        </div>
      </section>

      {/* Delivery Table */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Deliveries</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Food Chart</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(deliveries) &&deliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No deliveries available</TableCell>
              </TableRow>
            ) : (
              deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.id}</TableCell>
                  <TableCell>{`Food Chart #${delivery.foodChartId}`}</TableCell>
                  <TableCell>
                    <select
                      value={delivery.status}
                      onChange={(e) => handleUpdateDelivery(delivery.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </TableCell>
                  <TableCell>{delivery.notes || "N/A"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteDelivery(delivery.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default DeliveryDashboard;
