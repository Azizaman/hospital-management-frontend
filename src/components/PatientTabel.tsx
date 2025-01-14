import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Row } from '@tanstack/react-table'; // Correct imports from react-table

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
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Patient and FoodChart types
export type Patient = {
  id: string;
  name: string;
  email: string;
  age: number;
  status: string;
  disease: string;
  roomNumber: number;
};

export type FoodChart = {
  id: string;
  morningMeal: string;
  eveningMeal: string;
  nightMeal: string;
  instructions: string;
  ingredients: string;
};

// ColumnHelper (use correct import)
const columnHelper = createColumnHelper<Patient>();

export function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [newPatient, setNewPatient] = useState<Patient>({
    id: '',
    name: '',
    email: '',
    age: 0,
    status: 'pending',
    disease: '',
    roomNumber: 0,
  });
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [selectedFoodChart, setSelectedFoodChart] = useState<FoodChart | null>(null);
  const token = localStorage.getItem('token');

  // Fetch patients from the backend
  const fetchPatients = async () => {
    try {
      const response = await axios.get('https://hospital-management-backend-zlyb.onrender.com/patient', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Fetch food chart for a patient
  const fetchFoodChart = async (patientId: string) => {
    try {
      const response = await axios.get(`https://hospital-management-backend-zlyb.onrender.com/food-chart/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedFoodChart(response.data.foodChart);
    } catch (error) {
      console.error('Error fetching food chart:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Define table columns
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: { row: Row<Patient> }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('age', {
        header: 'Age',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('disease', {
        header: 'Disease',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('roomNumber', {
        header: 'Room Number',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => info.getValue(),
      }),
      {
        id: 'foodChart',
        header: 'Food Chart',
        cell: ({ row }: { row: Row<Patient> }) => (
          <Button onClick={() => fetchFoodChart(row.original.id)}>
            View Food Chart
          </Button>
        ),
      },
    ],
    []
  );

  // Initialize react-table
  const table = useReactTable({
    columns,
    data: patients,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  // Add a new patient
  const handleAddPatient = async () => {
    try {
      await axios.post(
        'https://hospital-management-backend-zlyb.onrender.com/patient',
        { ...newPatient, age: Number(newPatient.age), roomNumber: Number(newPatient.roomNumber) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch updated list of patients
      fetchPatients();

      setNewPatient({ id: '', name: '', email: '', age: 0, status: 'pending', disease: '', roomNumber: 0 });
      setShowAddPatientForm(false);
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  // Delete selected patients
  const handleDeleteSelected = async () => {
    try {
      const selectedIds = Object.keys(rowSelection)
        .filter((key) => rowSelection[key])
        .map((key) => table.getRow(key)?.original.id);

      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`https://hospital-management-backend-zlyb.onrender.com/patient/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      // Fetch updated list of patients
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patients:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Button onClick={() => setShowAddPatientForm(!showAddPatientForm)}>
          {showAddPatientForm ? 'Cancel' : 'Add Patient'}
        </Button>
      </div>

      {showAddPatientForm && (
        <div className="p-4 border rounded-md mt-4">
          <h3 className="text-lg font-semibold">Add New Patient</h3>
          <div className="mt-4">
            <Input
              placeholder="Name"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Email"
              value={newPatient.email}
              onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Age"
              type="number"
              value={newPatient.age === 0 ? '' : newPatient.age}
              onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
              className="mb-2"
            />
            <Input
              placeholder="Disease"
              value={newPatient.disease}
              onChange={(e) => setNewPatient({ ...newPatient, disease: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Room Number"
              type="number"
              value={newPatient.roomNumber === 0 ? '' : newPatient.roomNumber}
              onChange={(e) => setNewPatient({ ...newPatient, roomNumber: Number(e.target.value) })}
              className="mb-2"
            />
          </div>
          <Button onClick={handleAddPatient} className="mt-4 ml-10 px-9 space-y-6">Add Patient</Button>
        </div>
      )}

      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : ''}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center py-4">
        <Button
          variant="destructive"
          className="ml-auto"
          onClick={handleDeleteSelected}
          disabled={Object.keys(rowSelection).filter((key) => rowSelection[key]).length === 0}
        >
          Delete Selected
        </Button>
      </div>

      {/* Display Food Chart Details */}
      {selectedFoodChart && (
        <div className="mt-4 p-4 border rounded-md">
          <h3 className="text-lg font-semibold">Food Chart Details</h3>
          <div>
            <p><strong>Morning Meal:</strong> {selectedFoodChart.morningMeal}</p>
            <p><strong>Evening Meal:</strong> {selectedFoodChart.eveningMeal}</p>
            <p><strong>Night Meal:</strong> {selectedFoodChart.nightMeal}</p>
            <p><strong>Ingredients:</strong> {selectedFoodChart.ingredients}</p>
            <p><strong>Instructions:</strong> {selectedFoodChart.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}
