import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import UsersPage from "./pages/UsersPage";
import VehiclesPage from "./pages/VehiclesPage";
import RentedVehiclesPage from "./pages/RentedVehiclesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="rentals" element={<RentedVehiclesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
