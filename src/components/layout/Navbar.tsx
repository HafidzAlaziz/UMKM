"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

interface NavbarProps {
    onCartClick: () => void;
}



export function Navbar({ onCartClick }: NavbarProps) {
    const items = useCartStore((state) => state.items);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        setIsMenuOpen(false); // Always close menu

        // Check if it's a hash link
        if (href.includes("#")) {
            const [path, hash] = href.split("#");

            // If we are on the same page (e.g. href="/#about" and pathname="/")
            // OR if href="#about"
            if (pathname === path || (path === "" && pathname === "/") || (path === "/" && pathname === "/")) {
                e.preventDefault();
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2" onClick={(e) => handleScroll(e, "/")}>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                            <img
                                src="/images/ui/logo-pattern.jpg"
                                alt="UMKM Logo Pattern"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" /> {/* Overlay for contrast */}
                            <span className="relative z-10 text-white font-bold text-xl drop-shadow-md">U</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            UMKM Store
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                            Beranda
                        </Link>
                        <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                            Produk
                        </Link>
                        <Link
                            href="/#how-to-buy"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            onClick={(e) => handleScroll(e, "/#how-to-buy")}
                        >
                            Cara Belanja
                        </Link>
                        <Link
                            href="/#about"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            onClick={(e) => handleScroll(e, "/#about")}
                        >
                            Tentang Kami
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={onCartClick}
                            className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="px-4 py-3 space-y-3">
                        <Link
                            href="/"
                            className="block text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/products"
                            className="block text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Produk
                        </Link>
                        <Link
                            href="/#how-to-buy"
                            className="block text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={(e) => handleScroll(e, "/#how-to-buy")}
                        >
                            Cara Belanja
                        </Link>
                        <Link
                            href="/#about"
                            className="block text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={(e) => handleScroll(e, "/#about")}
                        >
                            Tentang Kami
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
