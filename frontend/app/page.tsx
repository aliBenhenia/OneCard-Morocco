"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoryIcons } from "@/components/category-icons"
import { ProductSlider } from "@/components/product-slider"
import { Footer } from "@/components/footer"
import {AboutPage} from "@/components/about"
import { HeroSkeleton, ProductSliderSkeleton, CategoryIconSkeleton } from "@/components/skeleton-loader"

const offersProducts = [
  {
    id: "1",
    name: "Yalla Ludo - USD 100 Diamonds (INT)",
    price: 356.25,
    originalPrice: 375,
    image: "/placeholder-w9a1p.png",
    rating: 4.8,
    reviewCount: 1250,
    category: "Gaming",
    discount: 5,
  },
  {
    id: "2",
    name: "Amazon (US) Gift Card - USD 50",
    price: 195,
    originalPrice: 205,
    image: "/amazon-gift-card-orange.png",
    rating: 4.9,
    reviewCount: 890,
    category: "Retail",
    discount: 5,
  },
  {
    id: "3",
    name: "Razer Gold - $100 (Global)",
    price: 355,
    originalPrice: 375,
    image: "/placeholder-wuh9i.png",
    rating: 4.7,
    reviewCount: 2100,
    category: "Gaming",
    discount: 5,
  },
  {
    id: "4",
    name: "Apple & iTunes Giftcard $100 (US Store)",
    price: 363,
    originalPrice: 382,
    image: "/itunes-gift-card-pink.png",
    rating: 4.9,
    reviewCount: 3200,
    category: "Entertainment",
    discount: 5,
  },
]

const recentlyAdded = [
  {
    id: "5",
    name: "Razer Gold - $200 (Global)",
    price: 730,
    originalPrice: 750,
    image: "/razer-gold-black-card-200.png",
    rating: 4.7,
    reviewCount: 420,
    category: "Gaming",
    discount: 3,
  },
  {
    id: "6",
    name: "Yalla Ludo - USD 100 Diamonds (INT)",
    price: 356.25,
    originalPrice: 375,
    image: "/yalla-ludo-teal-card.png",
    rating: 4.8,
    reviewCount: 650,
    category: "Gaming",
    discount: 5,
  },
  {
    id: "7",
    name: "Ludo Club $100 - 50M Coin",
    price: 365,
    originalPrice: 385,
    image: "/placeholder-1kt6x.png",
    rating: 4.9,
    reviewCount: 1100,
    category: "Gaming",
    discount: 5,
  },
  {
    id: "8",
    name: "Red Bull Data Recharge Card 100GB For 3 Months",
    price: 253,
    image: "/generic-energy-drink-data-card.png",
    rating: 4.6,
    reviewCount: 380,
    category: "Mobile",
  },
  {
    id: "9",
    name: "Google Play Gift Card - $50",
    price: 195,
    originalPrice: 205,
    image: "/generic-energy-drink-data-card.png",
    rating: 4.8,
    reviewCount: 1500,
    category: "Entertainment",
    discount: 5,
  },
  {
    id: "10",
    name: "Spotify Premium Gift Card - $30",
    price: 195,
    originalPrice: 205,
    image: "/generic-energy-drink-data-card.png",
    rating: 4.8,
    reviewCount: 1500,
    category: "Entertainment",
    discount: 5,
  },
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // Simulate 1.5 second loading time

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* <Navbar /> */}

      {isLoading ? (
        <>
          <HeroSkeleton />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <CategoryIconSkeleton key={i} />
              ))}
            </div>
            <ProductSliderSkeleton />
            <ProductSliderSkeleton />
          </div>
        </>
      ) : (
        <>
          <HeroSection />
          <CategoryIcons />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProductSlider title="Offers you can't miss" products={offersProducts} />
            <ProductSlider title="Recently added" products={recentlyAdded} />
          </main>
        </>
      )}
      <AboutPage />
      <Footer />
    </div>
  )
}
