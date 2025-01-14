import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Loginpage';
import Register from './components/Registerpage';
import ManagerDashboard from '../src/components/ManagerDashboard';
import PantryDashboard from './components/PantryDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import PrivateRoute from './components/PrivateRoute';

import { PatientTable } from './components/PatientTabel';
import { FoodChartTable } from './components/FoodChartTable';
import PantryTabel from './components/PantryTabel';
import PantryManList from './components/PantryManList';
import MealPreparation from './components/MealPreparation';
import DeliveryTable from './components/DeliveryTable';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* Role-Based Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['manager']} />}>
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['pantry','manager']} />}>
          <Route path="/pantry-dashboard" element={<PantryDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['delivery','manager']} />}>
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['manager']} />}>
          <Route path="/manage-patients" element={<PatientTable/>} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['manager','pantry']}/>}>
        <Route path="/manage-diet-charts" element={<FoodChartTable/>} />

        </Route>

        <Route path='/pantrylist' element={<PantryManList/>} />
        <Route path='/view-pantry-stocks' element={<PantryTabel/>}/>
        <Route path='/track-meals' element={<MealPreparation/>} />
        <Route path='/view-deliveries' element={<DeliveryTable/>} />
        

      </Routes>
    </Router>
  );
};

export default App;

