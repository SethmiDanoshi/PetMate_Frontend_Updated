// src/components/Payment/PaymentModal.jsx
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { createOrder, createPaymentIntent } from "../../apis/paymnetApis";
import { FaTimes, FaCreditCard, FaShieldAlt } from "react-icons/fa";

const PaymentModal = ({ open, onClose, item, itemType, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!stripe || !elements) return;

        try {
            setProcessing(true);

            const data = {
                amount: Math.round(item.price * 100),
                currency: "LKR",
                metadata: { 
                    itemId: item.id, 
                    itemType: itemType, 
                    itemName: item.productName || item.name 
                }
            };

            const resp = await createPaymentIntent(data);
            const clientSecret = resp.data.clientSecret;

            const cardElement = elements.getElement(CardElement);
            const confirmResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { 
                    card: cardElement, 
                    billing_details: { 
                        name: "Buyer",
                        email: sessionStorage.getItem("email") || "buyer@example.com"
                    } 
                }
            });

            if (confirmResult.error) {
                setError(confirmResult.error.message);
                setProcessing(false);
                return;
            }

            if (confirmResult.paymentIntent && confirmResult.paymentIntent.status === "succeeded") {
                const orderData = {
                    itemId: item.id,
                    itemType: itemType,
                    amount: item.price,
                    sellerId: item.sellerId,
                    currency: "LKR",
                    paymentIntentId: confirmResult.paymentIntent.id,
                    buyerId: sessionStorage.getItem("uid")
                };

                await createOrder(orderData);
                onSuccess(confirmResult.paymentIntent);
                setProcessing(false);
                onClose();
            } else {
                setError("Payment did not succeed.");
                setProcessing(false);
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Payment failed");
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Complete Purchase</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {item.productName || item.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={processing}
                    >
                        <FaTimes className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Order Summary */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Item Price</span>
                        <span className="font-semibold">LKR {item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-semibold">LKR 0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-[#640D56]">
                            LKR {item.price.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                            <FaCreditCard className="w-4 h-4 mr-2" />
                            Card Details
                        </label>
                        <div className="border border-gray-300 rounded-xl p-3 hover:border-gray-400 focus-within:border-[#640D56] focus-within:ring-2 focus-within:ring-[#640D56]/20 transition-colors">
                            <CardElement 
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#a0aec0',
                                            },
                                        },
                                    },
                                    hidePostalCode: true
                                }}
                            />
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center justify-center mb-6 p-3 bg-blue-50 rounded-lg">
                        <FaShieldAlt className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-sm text-blue-700">Your payment is secure and encrypted</span>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!stripe || processing}
                            className="flex-1 px-4 py-3 bg-[#640D56] text-white rounded-xl hover:bg-[#8A2BE2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                `Pay LKR ${item.price.toFixed(2)}`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;