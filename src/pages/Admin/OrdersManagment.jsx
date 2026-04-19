// src/pages/Admin/OrdersManagement.jsx
import React, { useState, useEffect } from 'react';

import { Search, Filter, ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getAllOrders } from '../../apis/adminApi';
import AdminSidebar from '../../components/Admin/AdminSidebar';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                setOrders(Array.isArray(response) ? response : response?.data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.itemId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusConfig = {
        PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const getStatusConfig = (status) => {
        return statusConfig[status] || statusConfig.PENDING;
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
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
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-600">Manage all customer orders</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total: {filteredOrders.length} orders
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                        {orders.filter(o => o.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {orders.filter(o => o.status === 'COMPLETED').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {orders.filter(o => o.status === 'CANCELLED').length}
                    </div>
                    <div className="text-sm text-gray-600">Cancelled</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map((order) => {
                    const status = getStatusConfig(order.status);
                    const IconComponent = status.icon;

                    return (
                        <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                                    <p className="text-sm text-gray-600">Item: {order.itemId.slice(-8)} ({order.itemType})</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                    <IconComponent className="h-3 w-3" />
                                    {order.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Amount</p>
                                    <p className="font-semibold text-gray-900">{order.currency} {order.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Buyer ID</p>
                                    <p className="font-semibold text-gray-900">{order.buyerId.slice(-8)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Seller ID</p>
                                    <p className="font-semibold text-gray-900">{order.sellerId.slice(-8)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Created</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Payment ID</p>
                                    <p className="font-semibold text-gray-900">{order.paymentIntentId?.slice(-8) || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
      </div>
    </div>
    );
};

export default OrdersManagement;