"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilter } from "@/components/products/ProductFilter";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PRODUCTS } from "@/lib/data";

export default function ProductsPage() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Derive categories from data
    const categories = useMemo(() => {
        const uniqueCategories = new Set(PRODUCTS.map(p => p.category));
        return Array.from(uniqueCategories);
    }, []);

    // Filter and Sort Logic
    const filteredProducts = useMemo(() => {
        let result = [...PRODUCTS];

        // 1. Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
            );
        }

        // 2. Category
        if (selectedCategory) {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // 3. Sort
        switch (sortBy) {
            case "price_low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price_high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name_asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "newest":
            default:
                // Assuming default array order is "newest" or by ID for now
                // If we had a date field, we'd use that.
                break;
        }

        return result;
    }, [searchQuery, selectedCategory, sortBy]);

    return (
        <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
            <Navbar onCartClick={() => setIsCartOpen(true)} />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Semua Produk
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Temukan produk UMKM terbaik yang sesuai dengan kebutuhan Anda.
                    </p>
                </div>

                <ProductFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                />

                {filteredProducts.length > 0 ? (
                    <ProductGrid products={filteredProducts} />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Produk tidak ditemukan.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </main>
    );
}
