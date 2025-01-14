import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
  TableHead,
} from "@/components/ui"; // Assuming these components exist

const PantryTable: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    pantryStaffId: "",
    task: "",
    status: "pending",
  });
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch all pantry tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://hospital-management-backend-zlyb.onrender.com/pantry-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setTasks(response.data.tasks); // Updated to match the response field
      } else {
        console.error("Error fetching tasks:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle creating a new task
  const handleAddTask = async () => {
    const { pantryStaffId, task, status } = newTask;
    if (!pantryStaffId || !task) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "https://hospital-management-backend-zlyb.onrender.com/pantry-items",
        {
          pantryStaffId: parseInt(pantryStaffId), // Ensure numeric ID
          task,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        fetchTasks(); // Refresh tasks list after adding a new task
        setShowAddTaskForm(false); // Hide form after task creation
        setNewTask({ pantryStaffId: "", task: "", status: "pending" });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`https://hospital-management-backend-zlyb.onrender.com/pantry-items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh tasks list after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle updating task status
  const handleUpdateTaskStatus = async (id: number, status: string) => {
    try {
      const response = await axios.put(
        `https://hospital-management-backend-zlyb.onrender.com/pantry-items/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        fetchTasks(); // Refresh tasks list after status update
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Pantry Task List</h1>

      {/* Add Task Form */}
      {showAddTaskForm ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Pantry Staff ID"
            value={newTask.pantryStaffId}
            onChange={(e) =>
              setNewTask({ ...newTask, pantryStaffId: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTask.task}
            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newTask.status}
            onChange={(e) =>
              setNewTask({ ...newTask, status: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div>
            <Button
              onClick={handleAddTask}
              className="mt-2 bg-black text-white rounded hover:bg-gray-700"
            >
              Add Task
            </Button>
            <Button
              onClick={() => setShowAddTaskForm(false)}
              className="mt-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setShowAddTaskForm(true)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Add New Task
        </Button>
      )}

      {/* Task List Table */}
      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Staff Name</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task: any) => (
                <TableRow key={task.id}>
                  <TableCell>{task.task}</TableCell>
                  <TableCell>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateTaskStatus(task.id, e.target.value)
                      }
                      className="p-2 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    {task.pantryStaff?.name || "Unknown"} {/* Handle null cases */}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No tasks available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PantryTable;
