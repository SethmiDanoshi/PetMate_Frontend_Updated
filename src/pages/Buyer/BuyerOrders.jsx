// src/pages/Buyer/BuyerOrders.jsx
import React, { useState, useEffect } from "react";
import BuyerSidebar from "../../components/Buyer/BuyerSidebar";
import { Search, Filter, Package, Clock, CheckCircle, XCircle, DollarSign, Calendar, User, Mail, Phone, MapPin, Store, Star } from "lucide-react";
import { fetchOrdersByBuyer } from "../../apis/orderApi";
import { getSellerDetails } from "../../apis/adminApi";


const SellerDetailsModal = ({ sellerId, isOpen, onClose }) => {
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && sellerId) {
            fetchSellerDetails();
        }
    }, [isOpen, sellerId]);

    const fetchSellerDetails = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getSellerDetails(sellerId);
            setSeller(response.data);
        } catch (err) {
            console.error("Error fetching seller details:", err);
            setError("Failed to load seller details");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                            <Store className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Seller Details</h2>
                            <p className="text-sm text-gray-600">Contact information</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XCircle className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                            <p className="text-gray-600">Loading seller details...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="p-3 bg-red-100 rounded-xl mb-4">
                                <XCircle className="w-8 h-8 text-red-600 mx-auto" />
                            </div>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchSellerDetails}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : seller ? (
                        <div className="space-y-6">
                            {/* Seller Profile */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{seller.fullName}</h3>
                                <div className="flex items-center justify-center space-x-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                                </div>
                                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Verified Seller
                                </span>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Contact Information</h4>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Mail className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="text-sm font-medium text-gray-900">{seller.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Phone className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="text-sm font-medium text-gray-900">{seller.mobileNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <MapPin className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Location</p>
                                            <p className="text-sm font-medium text-gray-900">Colombo, Sri Lanka</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 bg-purple-50 rounded-xl">
                                    <div className="text-lg font-bold text-purple-600">50+</div>
                                    <div className="text-xs text-gray-600">Products</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-xl">
                                    <div className="text-lg font-bold text-green-600">98%</div>
                                    <div className="text-xs text-gray-600">Rating</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-xl">
                                    <div className="text-lg font-bold text-blue-600">2Y+</div>
                                    <div className="text-xs text-gray-600">Selling</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4 border-t border-gray-200">
                                <button className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium">
                                    Send Message
                                </button>
                                <button className="flex-1 border border-purple-600 text-purple-600 py-3 rounded-xl hover:bg-purple-50 transition-colors font-medium">
                                    View Store
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

const BuyerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showSellerModal, setShowSellerModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const buyerId = localStorage.getItem("uid") || sessionStorage.getItem("uid");
            if (!buyerId) {
                showToast("Buyer ID not found", "error");
                return;
            }

            const response = await fetchOrdersByBuyer(buyerId);
            if (response) {
                setOrders(Array.isArray(response) ? response : response.data || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            showToast("Failed to load orders", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = "info") => {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
            }`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    };

    const handleContactSeller = (sellerId) => {
        setSelectedSeller(sellerId);
        setShowSellerModal(true);
    };

    // Filter orders based on search term and filters
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.itemId?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "ALL" || order.status === statusFilter;

        const matchesType =
            typeFilter === "ALL" || order.itemType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const statusConfig = {
        PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
        COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
        CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
        SHIPPED: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Shipped' }, 
        PROCESSING: { color: 'bg-purple-100 text-purple-800', icon: Calendar, label: 'Processing' },
        PAID: { color: 'bg-teal-100 text-teal-800', icon: DollarSign, label: 'Paid' },
        REFUNDED: { color: 'bg-pink-100 text-pink-800', icon: XCircle, label: 'Refunded' },
        ALL: { color: 'bg-gray-100 text-gray-800', icon: Package, label: 'All' }, 
    };

    const getStatusConfig = (status) => {
        return statusConfig[status] || statusConfig.PENDING;
    };

    // Statistics
    const stats = {
        total: orders.length,
        pending: orders.filter(order => order.status === 'PENDING').length,
        completed: orders.filter(order => order.status === 'COMPLETED').length,
        cancelled: orders.filter(order => order.status === 'CANCELLED').length,
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <BuyerSidebar />
                <div className="flex-1 p-6">
                    <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
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
            <BuyerSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Irish Grover" }}>
                            My Orders
                        </h1>
                        <p className="text-gray-600 mt-1">View and manage your purchase history</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Orders</div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mx-auto mb-3">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mx-auto mb-3">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
                        <div className="text-sm text-gray-600">Cancelled</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
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
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="ALL">All Types</option>
                                <option value="pet">Pets</option>
                                <option value="product">Products</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
                            <p className="text-gray-600">
                                {orders.length === 0
                                    ? "You haven't placed any orders yet."
                                    : "Try adjusting your search or filter criteria"
                                }
                            </p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const status = getStatusConfig(order.status);
                            const IconComponent = status.icon;

                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Order #{order.id?.slice(-8)}</h3>
                                            <p className="text-sm text-gray-600">Item: {order.itemId?.slice(-8)} ({order.itemType})</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                            <IconComponent className="h-3 w-3" />
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-green-600" />
                                            <div>
                                                <p className="text-gray-500">Amount</p>
                                                <p className="font-semibold text-gray-900">
                                                    {order.currency} {order.amount?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-blue-600" />
                                            <div>
                                                <p className="text-gray-500">Item Type</p>
                                                <p className="font-semibold text-gray-900 capitalize">{order.itemType}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-purple-600" />
                                            <div>
                                                <p className="text-gray-500">Order Date</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 text-gray-400">
                                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Payment ID</p>
                                                <p className="font-semibold text-gray-900 text-xs">
                                                    {order.paymentIntentId?.slice(-8) || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                                        <button 
                                            onClick={() => handleContactSeller(order.sellerId)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <User className="h-4 w-4" />
                                            Contact Seller
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Seller Details Modal */}
            <SellerDetailsModal
                sellerId={selectedSeller}
                isOpen={showSellerModal}
                onClose={() => {
                    setShowSellerModal(false);
                    setSelectedSeller(null);
                }}
            />
        </div>
    );
};

export default BuyerOrders;