// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { 
  getAllOrders, 
  getAllPets, 
  getAllProducts, 
  getAllUsers, 
  getPendingDoctors, 
  getVerifiesDoctors 
} from "../../apis/adminApi";
import { 
  Users, 
  ShoppingCart, 
  PawPrint, 
  Stethoscope, 
  Package, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

// Simple Chart Components
const BarChart = ({ data, colors }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-24 text-sm text-gray-600 font-medium">{item.label}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div 
                className="h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              ></div>
              <span className="text-sm font-semibold text-gray-700 min-w-8">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="-4 0 38 34" className="w-28 h-28 transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -accumulated;
          accumulated += percentage;

          return (
            <circle
              key={index}
              cx="16"
              cy="16"
              r="15.9155"
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth="2"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend, description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-green-600 font-medium">{trend}</span>
          <span className="text-gray-500">this month</span>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSellers: 0,
    totalBuyers: 0,
    totalVetDoctors: 0,
    totalRequests: 0,
    sellerRequests: 0,
    vetDoctorRequests: 0,
    totalProducts: 0,
    totalPets: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  
  const [loading, setLoading] = useState(true);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [
          usersResponse,
          pendingDoctorsResponse,
          verifiedDoctorsResponse,
          productsResponse,
          petsResponse,
          ordersResponse
        ] = await Promise.all([
          getAllUsers(),
          getPendingDoctors(),
          getVerifiesDoctors(),
          getAllProducts(),
          getAllPets(),
          getAllOrders()
        ]);

        // Process data
        const users = usersResponse?.data || [];
        const pendingDoctors = pendingDoctorsResponse?.data || [];
        const verifiedDoctors = verifiedDoctorsResponse?.data || [];
        const products = productsResponse?.data || [];
        const pets = petsResponse?.data || [];
        const orders = Array.isArray(ordersResponse) ? ordersResponse : ordersResponse?.data || [];

        // Calculate statistics
        const sellers = users.filter(user => user.role === 'SELLER');
        const buyers = users.filter(user => user.role === 'BUYER');
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const pendingOrders = orders.filter(order => order.status === 'PENDING').length;

        setStats({
          totalSellers: sellers.length,
          totalBuyers: buyers.length,
          totalVetDoctors: verifiedDoctors.length,
          totalRequests: pendingDoctors.length,
          sellerRequests: 0, // You might need a separate API for this
          vetDoctorRequests: pendingDoctors.length,
          totalProducts: products.length,
          totalPets: pets.length,
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders
        });

      } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Chart data
  const userDistributionData = [
    { label: 'Sellers', value: stats.totalSellers },
    { label: 'Buyers', value: stats.totalBuyers },
    { label: 'Vet Doctors', value: stats.totalVetDoctors },
  ];

  const inventoryData = [
    { label: 'Pets', value: stats.totalPets },
    { label: 'Products', value: stats.totalProducts },
  ];

  const orderStatusData = [
    { label: 'Completed', value: stats.totalOrders - stats.pendingOrders },
    { label: 'Pending', value: stats.pendingOrders },
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 h-32">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Irish Grover" }}>
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome to your administration panel</p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalSellers + stats.totalBuyers + stats.totalVetDoctors}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            description="All platform users"
          />
          
          <StatCard
            title="Total Revenue"
            value={`LKR ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
            description="Total sales amount"
          />
          
          <StatCard
            title="Pending Requests"
            value={stats.vetDoctorRequests}
            icon={AlertCircle}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            description="Awaiting approval"
          />
          
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            description="All time orders"
          />
        </div>

        {/* Charts and Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
            </div>
            <BarChart 
              data={userDistributionData} 
              colors={['#3B82F6', '#10B981', '#F59E0B']}
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {userDistributionData.map((item, index) => (
                <div key={item.label} className="text-center">
                  <div className="text-xl font-bold" style={{ color: ['#3B82F6', '#10B981', '#F59E0B'][index] }}>
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Inventory Overview</h3>
            </div>
            <div className="flex flex-col items-center">
              <DonutChart 
                data={inventoryData} 
                colors={['#8B5CF6', '#3B82F6']}
              />
              <div className="mt-6 space-y-3 w-full">
                {inventoryData.map((item, index) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: ['#8B5CF6', '#3B82F6'][index] }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Completed Orders</span>
                </div>
                <span className="font-bold text-green-700">{stats.totalOrders - stats.pendingOrders}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Pending Orders</span>
                </div>
                <span className="font-bold text-yellow-700">{stats.pendingOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sellers & Buyers */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Total Sellers</span>
                </div>
                <span className="font-bold text-blue-700">{stats.totalSellers}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-600" />
                  <span className="text-sm font-medium text-cyan-800">Total Buyers</span>
                </div>
                <span className="font-bold text-cyan-700">{stats.totalBuyers}</span>
              </div>
            </div>
          </div>

          {/* Veterinary Statistics */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Veterinary Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Verified Doctors</span>
                </div>
                <span className="font-bold text-purple-700">{stats.totalVetDoctors}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Pending Requests</span>
                </div>
                <span className="font-bold text-red-700">{stats.vetDoctorRequests}</span>
              </div>
            </div>
          </div>

          {/* Products & Pets */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <PawPrint className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Total Pets</span>
                </div>
                <span className="font-bold text-green-700">{stats.totalPets}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Total Products</span>
                </div>
                <span className="font-bold text-orange-700">{stats.totalProducts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-200">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Manage Users</div>
              <div className="text-sm text-gray-600">View all users</div>
            </button>
            
            <button className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-200">
              <Stethoscope className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Vet Requests</div>
              <div className="text-sm text-gray-600">{stats.vetDoctorRequests} pending</div>
            </button>
            
            <button className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-200">
              <ShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">View Orders</div>
              <div className="text-sm text-gray-600">{stats.pendingOrders} pending</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;