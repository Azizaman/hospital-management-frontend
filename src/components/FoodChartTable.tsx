import  { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui";

// Type definition for a food chart entry
export type FoodChart = {
  id?: number; // Make sure id is a number
  patientId: number;
  morningMeal: string;
  eveningMeal: string;
  nightMeal: string;
  ingredients?: string;
  instructions?: string;
};

export function FoodChartTable() {
  const [foodCharts, setFoodCharts] = useState<FoodChart[]>([]);
  const [newFoodChart, setNewFoodChart] = useState<FoodChart>({
    patientId: 0,
    morningMeal: "",
    eveningMeal: "",
    nightMeal: "",
    ingredients: "",
    instructions: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFoodCharts, setSelectedFoodCharts] = useState<Set<number>>(new Set());
  const token = localStorage.getItem("token");

  // Fetch all food charts
  const fetchFoodCharts = async () => {
    try {
      const response = await axios.get("https://hospital-management-backend-zlyb.onrender.com/food-chart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoodCharts(response.data.foodchart || []);
    } catch (error) {
      console.error("Error fetching food charts:", error);
    }
  };

  useEffect(() => {
    fetchFoodCharts();
  }, []);

  // Handle adding a new food chart
  const handleAddFoodChart = async () => {
    const { patientId, morningMeal, eveningMeal, nightMeal } = newFoodChart;

    // Validate required fields
    if (!patientId || !morningMeal || !eveningMeal || !nightMeal) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const response = await axios.post(
        "https://hospital-management-backend-zlyb.onrender.com/food-chart",
        newFoodChart,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Food chart added successfully!");
        fetchFoodCharts(); // Refresh the list after adding
        setNewFoodChart({
          patientId: 0, // Reset to default value
          morningMeal: "",
          eveningMeal: "",
          nightMeal: "",
          ingredients: "",
          instructions: "",
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error adding food chart:", error);
      alert("Failed to add food chart.");
    }
  };

  // Handle selection of food chart (checkbox)
  const handleCheckboxChange = (id: number) => {
    const updatedSelection = new Set(selectedFoodCharts);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedFoodCharts(updatedSelection);
  };

  // Handle delete of selected food charts
  const handleDelete = async () => {
    if (selectedFoodCharts.size === 0) {
      alert("Please select at least one food chart to delete!");
      return;
    }

    try {
      // Delete selected food charts
      await Promise.all(
        Array.from(selectedFoodCharts).map(async (id) => {
          await axios.delete(`https://hospital-management-backend-zlyb.onrender.com/food-chart/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
      );

      alert("Selected food charts deleted successfully!");
      fetchFoodCharts(); // Refresh the list after deletion
      setSelectedFoodCharts(new Set()); // Reset the selected items
    } catch (error) {
      console.error("Error deleting food chart(s):", error);
      alert("Failed to delete selected food chart(s).");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center my-8 ml-6">
        <Button onClick={() => setShowAddForm(!showAddForm)} className="px-6">
          {showAddForm ? "Cancel" : "Add Food Chart"}
          
        </Button>
        <Button
          onClick={handleDelete}
          className="ml-4"
          disabled={selectedFoodCharts.size === 0}
        >
          Delete Selected
        </Button>
      </div>

      {showAddForm && (
        <div className="p-4 border rounded-md mt-4">
          <h3 className="text-lg font-semibold">Add New Food Chart</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input
              placeholder="Patient ID (required)"
              value={newFoodChart.patientId || ""}
              onChange={(e) =>
                setNewFoodChart({ ...newFoodChart, patientId: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Morning Meal (required)"
              value={newFoodChart.morningMeal}
              onChange={(e) =>
                setNewFoodChart({ ...newFoodChart, morningMeal: e.target.value })
              }
            />
            <Input
              placeholder="Evening Meal (required)"
              value={newFoodChart.eveningMeal}
              onChange={(e) =>
                setNewFoodChart({ ...newFoodChart, eveningMeal: e.target.value })
              }
            />
            <Input
              placeholder="Night Meal (required)"
              value={newFoodChart.nightMeal}
              onChange={(e) =>
                setNewFoodChart({ ...newFoodChart, nightMeal: e.target.value })
              }
            />
            <Input
              placeholder="Ingredients (optional)"
              value={newFoodChart.ingredients}
              onChange={(e) =>
                setNewFoodChart({
                  ...newFoodChart,
                  ingredients: e.target.value,
                })
              }
            />
            <Input
              placeholder="Instructions (optional)"
              value={newFoodChart.instructions}
              onChange={(e) =>
                setNewFoodChart({
                  ...newFoodChart,
                  instructions: e.target.value,
                })
              }
            />
          </div>
          <Button className="mt-4" onClick={handleAddFoodChart}>
            Add Food Chart
          </Button>
        </div>
      )}

      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={foodCharts.length > 0 && selectedFoodCharts.size === foodCharts.length}
                  onChange={() => {
                    if (selectedFoodCharts.size === foodCharts.length) {
                      setSelectedFoodCharts(new Set());
                    } else {
                      setSelectedFoodCharts(
                        new Set(foodCharts.filter((chart) => chart.id).map((chart) => chart.id!))
                      );
                    }
                  }}
                />
              </TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Morning Meal</TableHead>
              <TableHead>Evening Meal</TableHead>
              <TableHead>Night Meal</TableHead>
              <TableHead>Ingredients</TableHead>
              <TableHead>Instructions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodCharts.length > 0 ? (
              foodCharts.map((foodChart) => (
                <TableRow key={foodChart.id}>
                  <TableCell>
                    <Input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selectedFoodCharts.has(foodChart.id!)}
                      onChange={() => handleCheckboxChange(foodChart.id!)}
                    />
                  </TableCell>
                  <TableCell>{foodChart.patientId}</TableCell>
                  <TableCell>{foodChart.morningMeal}</TableCell>
                  <TableCell>{foodChart.eveningMeal}</TableCell>
                  <TableCell>{foodChart.nightMeal}</TableCell>
                  <TableCell>{foodChart.ingredients || "N/A"}</TableCell>
                  <TableCell>{foodChart.instructions || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No Food Charts Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
