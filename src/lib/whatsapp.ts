import { CartItem } from "@/store/useCartStore";
import { formatRupiah } from "./utils";

export const generateWhatsAppLink = (
    items: CartItem[],
    totalPrice: number,
    shippingCost: number,
    destination: string,
    customerName: string = "Pelanggan"
) => {
    const phone = "62895613114028"; // UMKM Store WhatsApp
    const grandTotal = totalPrice + shippingCost;

    let message = `Halo Admin, saya ingin memesan:\n\n`;

    items.forEach((item) => {
        message += `- ${item.name} x ${item.quantity} (${formatRupiah(item.price * item.quantity)})\n`;
    });

    message += `\n--------------------------------\n`;
    message += `Total Harga: ${formatRupiah(totalPrice)}\n`;
    message += `Ongkir ke ${destination}: ${formatRupiah(shippingCost)}\n`;
    message += `Grand Total: ${formatRupiah(grandTotal)}\n\n`;
    message += `Alamat Pengiriman: ...\n`;
    message += `(Mohon lengkapi alamat detail setelah pesan ini terkirim)`;

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
};
