// src/pages/Admin/PetsManagement.jsx
import React, { useState, useEffect } from 'react';

import { Search, Filter, PawPrint, MapPin, User, Phone } from 'lucide-react';
import { getAllPets } from '../../apis/adminApi';
import AdminSidebar from '../../components/Admin/AdminSidebar';

const PetsManagement = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await getAllPets();
                if (response?.status && response.data) {
                    setPets(response.data);
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, []);

    const filteredPets = pets.filter(pet => {
        const matchesSearch =
            pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || pet.type === filterType;
        return matchesSearch && matchesType;
    });

    const petTypes = ['ALL', ...new Set(pets.map(pet => pet.type))];

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
                    <h1 className="text-3xl font-bold text-gray-900">Pets Management</h1>
                    <p className="text-gray-600">Manage all pets listed for sale</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total: {filteredPets.length} pets
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search pets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            {petTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Pets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                    <div key={pet.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        <img
                            src={pet.imageUrls[0]}
                            alt={pet.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
                                    <p className="text-gray-600 text-sm">{pet.breed}</p>
                                </div>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                    {pet.type}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <PawPrint className="h-4 w-4" />
                                    <span>{pet.age} • {pet.weight}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>{pet.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="h-4 w-4" />
                                    <span>{pet.sellerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    <span>{pet.contactNumber}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-green-600">LKR {pet.price.toLocaleString()}</span>
                                <span className="text-sm text-gray-500">{new Date(pet.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPets.length === 0 && (
                <div className="text-center py-12">
                    <PawPrint className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No pets found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
      </div>
    </div>
    );
};

export default PetsManagement;