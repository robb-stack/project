import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <nav className="bg-blue-600 text-white p-4 flex gap-6">
        <Link to="/users" className="hover:underline">Users</Link>
        <Link to="/vehicles" className="hover:underline">Vehicles</Link>
        <Link to="/rentals" className="hover:underline">Rented Vehicles</Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
