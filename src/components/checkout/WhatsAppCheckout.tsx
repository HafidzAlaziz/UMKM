"use client";

import { useCartStore } from "@/store/useCartStore";
import { MessageCircle, Copy, Image as ImageIcon, Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";
import { OrderImageCanvas } from "./OrderImageCanvas";
import { formatOrderData, copyImageToClipboard, shareImage } from "@/lib/orderImageUtils";

interface WhatsAppCheckoutProps {
    shippingCost: number;
    destination: string;
}

export function WhatsAppCheckout({ shippingCost, destination }: WhatsAppCheckoutProps) {
    const { items, totalPrice } = useCartStore();
    const [showImageGenerator, setShowImageGenerator] = useState(false);
    const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [canShare, setCanShare] = useState(false);

    const isDisabled = shippingCost <= 0;
    const finalDestination = destination || "Konfirmasi Admin";

    const orderData = formatOrderData(items, totalPrice(), shippingCost, finalDestination);

    useEffect(() => {
        // Check if Web Share API is available
        setCanShare(!!navigator.share && !!navigator.canShare);
    }, []);

    const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
        setCanvasElement(canvas);
    }, []);

    const handleCopyImage = async () => {
        if (!canvasElement) return;

        setIsCopying(true);
        const success = await copyImageToClipboard(canvasElement);

        if (success) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        } else {
            alert('Gagal copy gambar. Silakan coba lagi atau gunakan browser yang mendukung.');
        }
        setIsCopying(false);
    };

    const handleShareImage = async () => {
        if (!canvasElement) return;

        setIsSharing(true);
        const success = await shareImage(canvasElement, orderData.orderId);

        if (!success) {
            alert('Gagal share gambar. Silakan gunakan tombol Copy atau Download.');
        }
        setIsSharing(false);
    };

    const handleOpenWhatsApp = () => {
        const message = `🛒 *PESANAN BARU - UMKM STORE*\n\n` +
            `Order ID: ${orderData.orderId}\n` +
            `Total: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(orderData.grandTotal)}\n\n` +
            `Saya sudah ${canShare ? 'share' : 'copy'} invoice pesanan.\n` +
            `Berikut saya kirimkan invoice dan alamat lengkap saya.`;

        const phone = "62895613114028";
        const link = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
        window.open(link, '_blank');
    };

    if (showImageGenerator) {
        return (
            <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                        {canShare
                            ? "📸 Invoice siap! Klik 'Share' untuk langsung kirim ke WhatsApp."
                            : "📸 Invoice siap! Copy gambar lalu paste di WhatsApp."
                        }
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto scrollbar-custom">
                    <OrderImageCanvas orderData={orderData} onCanvasReady={handleCanvasReady} />
                </div>

                {/* Share Button (Mobile) */}
                {canShare && (
                    <button
                        onClick={handleShareImage}
                        disabled={!canvasElement || isSharing}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Share2 className="w-5 h-5" />
                        {isSharing ? 'Sharing...' : 'Share Invoice ke WhatsApp'}
                    </button>
                )}

                {/* Copy Button (Desktop fallback) */}
                {!canShare && (
                    <button
                        onClick={handleCopyImage}
                        disabled={!canvasElement || isCopying}
                        className={cn(
                            "w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95",
                            isCopied
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                        )}
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-5 h-5" />
                                Gambar Ter-copy!
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                {isCopying ? 'Copying...' : 'Copy Invoice ke Clipboard'}
                            </>
                        )}
                    </button>
                )}

                {/* WhatsApp Button (for desktop users who copied) */}
                {!canShare && (
                    <button
                        onClick={handleOpenWhatsApp}
                        className="w-full py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Buka WhatsApp
                    </button>
                )}

                <button
                    onClick={() => setShowImageGenerator(false)}
                    className="w-full py-2 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200"
                >
                    ← Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {isDisabled && (
                <p className="text-[10px] text-red-500 font-medium text-center animate-pulse">
                    *Hitung ongkir dlu sebelum checkout ya!
                </p>
            )}
            <button
                onClick={() => setShowImageGenerator(true)}
                disabled={isDisabled}
                className={cn(
                    "w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95",
                    isDisabled
                        ? "bg-gray-400 cursor-not-allowed opacity-70 border border-gray-300 shadow-none"
                        : "bg-green-500 shadow-green-200 hover:bg-green-600 hover:shadow-green-300"
                )}
            >
                <ImageIcon className="w-5 h-5" />
                Generate Invoice & Checkout
            </button>
        </div>
    );
}
