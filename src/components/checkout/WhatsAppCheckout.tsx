"use client";

import { useCartStore } from "@/store/useCartStore";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppCheckoutProps {
    shippingCost: number;
    destination: string;
}

export function WhatsAppCheckout({ shippingCost, destination }: WhatsAppCheckoutProps) {
    const { items, totalPrice } = useCartStore();

    const isDisabled = shippingCost <= 0;
    const finalDestination = destination || "Konfirmasi Admin";

    const handleCheckout = () => {
        const link = generateWhatsAppLink(items, totalPrice(), shippingCost, finalDestination);
        window.open(link, '_blank');
    };

    return (
        <div className="space-y-2">
            {isDisabled && (
                <p className="text-[10px] text-red-500 font-medium text-center animate-pulse">
                    *Hitung ongkir dlu sebelum checkout ya!
                </p>
            )}
            <button
                onClick={handleCheckout}
                disabled={isDisabled}
                className={cn(
                    "w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95",
                    isDisabled
                        ? "bg-gray-400 cursor-not-allowed opacity-70 border border-gray-300 shadow-none"
                        : "bg-green-500 shadow-green-200 hover:bg-green-600 hover:shadow-green-300"
                )}
            >
                <MessageCircle className="w-5 h-5" />
                Checkout via WhatsApp
            </button>
        </div>
    );
}
