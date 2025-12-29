"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AboutSection } from "@/components/layout/AboutSection";
import { HowToBuySection } from "@/components/layout/HowToBuySection";
import { Footer } from "@/components/layout/Footer";
import { PRODUCTS } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main className="min-h-screen pb-20">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden relative min-h-[400px] flex items-center">
          {/* Background Image */}
          <img
            src="/images/ui/hero-bg.png"
            alt="UMKM Collage"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 md:bg-black/50" />

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Dukung Produk Lokal, <br />
              <span className="text-yellow-400">Kualitas Global</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 font-medium">
              Temukan berbagai produk UMKM terbaik pilihan kami. Belanja aman, cepat, dan langsung terhubung dengan penjual.
            </p>
            <a
              href="#products"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1"
            >
              Mulai Belanja
            </a>
          </div>

          <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Produk Unggulan</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm hidden sm:block">
            Lihat Semua &rarr;
          </Link>
        </div>

        <ProductGrid products={PRODUCTS.slice(0, 4)} />

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Lihat Semua Produk
          </Link>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* How To Buy Section */}
      <HowToBuySection />

      {/* Footer */}
      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main >
  );
}
