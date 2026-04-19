import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/Seller/SellerSidebar";
import { fetchOrdersBySeller, updateOrderStatus } from "../../apis/orderApi";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  ChevronDown,
  Calendar,
  User,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const sellerId = localStorage.getItem("uid") || sessionStorage.getItem("uid");

  // Order status configuration
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Clock, label: "Pending" },
    PAID: { color: "bg-blue-100 text-blue-800 border-blue-300", icon: CheckCircle, label: "Paid" },
    SHIPPED: { color: "bg-purple-100 text-purple-800 border-purple-300", icon: Truck, label: "Shipped" },
    COMPLETED: { color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle, label: "Completed" },
    CANCELLED: { color: "bg-red-100 text-red-800 border-red-300", icon: XCircle, label: "Cancelled" }
  };

  // Fetch orders 
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrdersBySeller(sellerId);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [sellerId]);

  // Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      
      // Update backend first
      await updateOrderStatus(orderId, newStatus);
      
      // Update locally only if API call succeeds
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      String(order.id).toLowerCase().includes(search.toLowerCase()) ||
      String(order.buyerId).toLowerCase().includes(search.toLowerCase()) ||
      order.status.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge component
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.PENDING;
    const IconComponent = config.icon;
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${config.color}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  // Order details modal
  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600">Order ID: #{order.id}</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Buyer ID</label>
                <p className="text-gray-900">{order.buyerId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-gray-900 font-semibold">Rs. {order.amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <p className="text-gray-900">{order.currency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="text-gray-900">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Irish Grover" }}>
              Manage Orders
            </h1>
            <p className="text-gray-600">
              Track and manage your customer orders efficiently
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  {Object.keys(statusConfig).map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors rounded-xl border border-gray-300 hover:border-gray-400"
              >
                Clear Filters
              </button>
            </div>

            {/* Search */}
            <div className="relative lg:w-80">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg mb-2">No orders found</p>
              <p className="text-gray-500 text-sm">
                {search || statusFilter !== "ALL" 
                  ? "Try adjusting your search or filters" 
                  : "You don't have any orders yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">#{order.id}</p>
                          <p className="text-sm text-gray-500">{order.currency}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{order.buyerId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">Rs. {order.amount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingOrder === order.id}
                          className={`appearance-none px-3 py-1.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                            statusConfig[order.status]?.color || statusConfig.PENDING.color
                          } ${updatingOrder === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {Object.keys(statusConfig).map((status) => (
                            <option key={status} value={status}>
                              {statusConfig[status].label}
                            </option>
                          ))}
                        </select>
                        {updatingOrder === order.id && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 ml-2 inline-block"></div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default SellerOrders;