"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoryIcons } from "@/components/category-icons"
import { ProductSlider } from "@/components/product-slider"
import { Footer } from "@/components/footer"
import { AboutPage } from "@/components/about"
import { HeroSkeleton, ProductSliderSkeleton, CategoryIconSkeleton } from "@/components/skeleton-loader"
import api from "@/api"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [offersProducts, setOffersProducts] = useState([])
  const [recentlyAdded, setRecentlyAdded] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/api/products")
        
        if (response.data.success) {
          const products = response.data.data
          
          // Split products into offers and recently added (mock logic)
          const offers = products.slice(0, 4)
          const recentlyAddedProducts = products.slice(4, 10)
          
          setOffersProducts(offers)
          setRecentlyAdded(recentlyAddedProducts)
        } else {
          setError("Failed to load products")
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setIsLoading(false)
        // Simulate minimum loading time for better UX
        // setTimeout(() => {
        //   setIsLoading(false)
        // }, 1000)
      }
    }

    fetchProducts()
  }, [])

  // Group products by category for sliders
  const groupProductsByCategory = (products) => {
    const grouped = {}
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = []
      }
      grouped[product.category].push(product)
    })
    return grouped
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 border border-red-700 rounded-xl max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* <Navbar /> */}

      {isLoading ? (
        <>
          {/* <HeroSkeleton /> */}
          {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <CategoryIconSkeleton key={i} />
              ))}
            </div>
            </div> */}
             <ProductSliderSkeleton />
             <ProductSliderSkeleton />
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