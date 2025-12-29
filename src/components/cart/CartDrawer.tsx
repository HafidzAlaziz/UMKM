"use client";

import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatRupiah, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ShippingSimulator } from "@/components/checkout/ShippingSimulator";
import { WhatsAppCheckout } from "@/components/checkout/WhatsAppCheckout";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'items' | 'checkout';

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('items');

    // State for shipping
    const [shippingCost, setShippingCost] = useState(0);
    const [destination, setDestination] = useState("");

    const handleShippingCalculated = (cost: number, city: string) => {
        setShippingCost(cost);
        setDestination(city);
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Reset to items tab when drawer opens
        if (isOpen) {
            setActiveTab('items');
        }
    }, [isOpen]);

    if (!isMounted) return null;

    const grandTotal = totalPrice() + shippingCost;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer - Made Wider */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-[70] w-full max-w-3xl bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 flex flex-col border-l border-gray-100 dark:border-gray-800",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Keranjang Belanja</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <button
                        onClick={() => setActiveTab('items')}
                        className={cn(
                            "flex-1 py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2",
                            activeTab === 'items'
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        )}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Pesanan ({items.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('checkout')}
                        className={cn(
                            "flex-1 py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2",
                            activeTab === 'checkout'
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        )}
                    >
                        <CreditCard className="w-5 h-5" />
                        <span>Checkout</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Items Tab */}
                    {activeTab === 'items' && (
                        <div className="p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">Keranjang masih kosong</p>
                                        <button
                                            onClick={onClose}
                                            className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                        >
                                            Mulai Belanja
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-blue-100 dark:hover:border-blue-900 transition-colors"
                                    >
                                        <div className="relative w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                                                    {formatRupiah(item.price)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md shadow-sm transition-all text-gray-600 dark:text-gray-300"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-bold w-8 text-center text-gray-900 dark:text-gray-100">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md shadow-sm transition-all text-gray-600 dark:text-gray-300"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors bg-transparent p-1"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Checkout Tab */}
                    {activeTab === 'checkout' && (
                        <div className="p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <CreditCard className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">Tidak ada pesanan untuk checkout</p>
                                        <button
                                            onClick={() => setActiveTab('items')}
                                            className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                        >
                                            Lihat Pesanan
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Shipping Simulator */}
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Hitung Ongkir</h3>
                                        <ShippingSimulator onShippingCalculated={handleShippingCalculated} />
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Ringkasan Pesanan</h3>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Subtotal ({items.length} item)</span>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{formatRupiah(totalPrice())}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Ongkir</span>
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {shippingCost > 0 ? formatRupiah(shippingCost) : "Hitung dulu"}
                                            </span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                            <span>Total</span>
                                            <span className="text-blue-600 dark:text-blue-400">{formatRupiah(grandTotal)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <WhatsAppCheckout shippingCost={shippingCost} destination={destination} />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Fallback icon
function ShoppingBagIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
    )
}
