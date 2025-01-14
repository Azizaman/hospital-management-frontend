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

const MealPreparation: React.FC = () => {
  const [mealPreparations, setMealPreparations] = useState<any[]>([]);
  const [newMeal, setNewMeal] = useState({
    foodChartId: 0,
    status: "pending",
    notes: "",
  });
  const token = localStorage.getItem("token");

  const fetchMealPreparations = async () => {
    try {
      const response = await axios.get("https://hospital-management-backend-zlyb.onrender.com/meal-preparation", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setMealPreparations(response.data.meals);
      }
    } catch (error) {
      console.error("Error fetching meal preparations:", error);
    }
  };

  const addMealPreparation = async () => {
    if (!newMeal.foodChartId || !newMeal.status) {
      alert("Food Chart ID and Status are required.");
      return;
    }
    try {
      const response = await axios.post(
        "https://hospital-management-backend-zlyb.onrender.com/meal-preparation",
        newMeal,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setNewMeal({ foodChartId: 0, status: "pending", notes: "" });
        fetchMealPreparations();
      }
    } catch (error) {
      console.error("Error adding meal preparation:", error);
    }
  };

  const deleteMealPreparation = async (id: number) => {
    try {
      await axios.delete(`https://hospital-management-backend-zlyb.onrender.com/meal-preparation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMealPreparations();
    } catch (error) {
      console.error("Error deleting meal preparation:", error);
    }
  };

  const updateMealPreparationStatus = async (id: number, status: string) => {
    try {
      const response = await axios.put(
        `https://hospital-management-backend-zlyb.onrender.com/meal-preparation/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        fetchMealPreparations();
      }
    } catch (error) {
      console.error("Error updating meal preparation status:", error);
    }
  };

  const viewFoodChart = (foodChartId?: number) => {
    if (!foodChartId) {
      alert("No Food Chart available for this meal.");
      return;
    }
    alert(`Viewing details for Food Chart ID: ${foodChartId}`);
    // Navigate to a specific food chart page or open a modal here
  };

  useEffect(() => {
    fetchMealPreparations();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Meal Preparations</h1>

      {/* Add New Meal Preparation */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Meal Preparation</h2>
        <div className="flex gap-4 items-center">
          <Input
            type="number"
            placeholder="Food Chart ID"
            value={newMeal.foodChartId}
            onChange={(e) =>
              setNewMeal({ ...newMeal, foodChartId: Number(e.target.value) })
            }
          />
          <select
            value={newMeal.status}
            onChange={(e) => setNewMeal({ ...newMeal, status: e.target.value })}
            className="border rounded p-2"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <Input
            type="text"
            placeholder="Notes (optional)"
            value={newMeal.notes}
            onChange={(e) =>
              setNewMeal({ ...newMeal, notes: e.target.value })
            }
          />
          <Button onClick={addMealPreparation} className="bg-green-600 text-white rounded">
            Add
          </Button>
        </div>
      </div>

      {/* Meal Preparations Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meal ID</TableHead>
            <TableHead>Food Chart ID</TableHead>
            <TableHead>Food Chart Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mealPreparations.map((meal) => (
            <TableRow key={meal.id}>
              <TableCell>{meal.id}</TableCell>
              <TableCell>
                {meal.foodChart ? meal.foodChart.id : "No Food Chart Assigned"}
              </TableCell>
              <TableCell>
                {meal.foodChart ? meal.foodChart.name : "No Name Available"}
              </TableCell>
              <TableCell>
                <select
                  value={meal.status}
                  onChange={(e) =>
                    updateMealPreparationStatus(meal.id, e.target.value)
                  }
                  className="border rounded p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </TableCell>
              <TableCell>{meal.notes || "N/A"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      viewFoodChart(meal.foodChart?.id)
                    }
                    className={`rounded ${
                      meal.foodChart ? "bg-blue-600" : "bg-gray-400"
                    } text-white`}
                    disabled={!meal.foodChart}
                  >
                    View Food Chart
                  </Button>
                  <Button
                    onClick={() => deleteMealPreparation(meal.id)}
                    className="bg-red-600 text-white rounded"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MealPreparation;
