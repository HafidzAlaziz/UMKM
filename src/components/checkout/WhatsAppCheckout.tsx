"use client";

import { useCartStore } from "@/store/useCartStore";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

interface WhatsAppCheckoutProps {
    shippingCost: number;
    destination: string;
}

export function WhatsAppCheckout({ shippingCost, destination }: WhatsAppCheckoutProps) {
    const { items, totalPrice } = useCartStore();

    const handleCheckout = () => {
        // If shipping cost is 0, user hasn't calculated it yet.
        // depending on requirements we could block this or just pass 0.
        // For now, we allow it but maybe with a clear default destination text if empty.

        const finalDestination = destination || "Konfirmasi Admin";
        const link = generateWhatsAppLink(items, totalPrice(), shippingCost, finalDestination);
        window.open(link, '_blank');
    };

    return (
        <button
            onClick={handleCheckout}
            className="w-full py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 hover:shadow-green-300 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
            <MessageCircle className="w-5 h-5" />
            Checkout via WhatsApp
        </button>
    );
}
