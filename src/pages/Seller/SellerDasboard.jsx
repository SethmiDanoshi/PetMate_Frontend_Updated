// src/pages/Seller/SellerDashboard.jsx
import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/Seller/SellerSidebar";


const SellerDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    productCount: 0,
    totalRevenue: 0,
  });

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/seller/dashboard"); // update API URL
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold mt-3" style={{ fontFamily: 'Irish Grover' }}>Hello  ....</h1>
          
        </div>

        {/* Banner Image */}
        <div className="mt-6 flex justify-center">
          <img src="/pet.png" alt="Pets" className="rounded-xl w-full max-w-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Total Users */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <p className="text-gray-600">Total Users</p>
            <p className="text-xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-xl font-bold text-green-600">{stats.totalOrders}</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <p className="text-gray-600">Pending Orders</p>
            <p className="text-xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>

          {/* Completed Orders */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <p className="text-gray-600">Completed Orders</p>
            <p className="text-xl font-bold text-green-500">{stats.completedOrders}</p>
          </div>

          {/* Product Count */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <p className="text-gray-600">Product Count</p>
            <p className="text-xl font-bold text-blue-500">{stats.productCount}</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-xl font-bold text-purple-600">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
