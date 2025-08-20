"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, TrendingUp, Zap, Gift } from "lucide-react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  discount?: number
  badge?: string
  trending?: boolean
  featured?: boolean
}

interface ProductSliderProps {
  title: string
  subtitle?: string
  products: Product[]
  showViewAll?: boolean
  variant?: "default" | "featured" | "trending" | "discount"
}

export function ProductSlider({ 
  title, 
  subtitle, 
  products, 
  showViewAll = true,
  variant = "default"
}: ProductSliderProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const getVariantStyles = () => {
    switch (variant) {
      case "featured":
        return {
          icon: <Star className="w-5 h-5" />,
          bgColor: "from-yellow-500/10 to-orange-500/10",
          borderColor: "border-yellow-500/20",
          titleColor: "text-yellow-400",
          gradient: "from-yellow-500 to-orange-500"
        }
      case "trending":
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          bgColor: "from-blue-500/10 to-cyan-500/10",
          borderColor: "border-blue-500/20",
          titleColor: "text-blue-400",
          gradient: "from-blue-500 to-cyan-500"
        }
      case "discount":
        return {
          icon: <Gift className="w-5 h-5" />,
          bgColor: "from-green-500/10 to-emerald-500/10",
          borderColor: "border-green-500/20",
          titleColor: "text-green-400",
          gradient: "from-green-500 to-emerald-500"
        }
      default:
        return {
          icon: <Zap className="w-5 h-5" />,
          bgColor: "from-purple-500/10 to-pink-500/10",
          borderColor: "border-purple-500/20",
          titleColor: "text-purple-400",
          gradient: "from-purple-500 to-pink-500"
        }
    }
  }

  const variantStyles = getVariantStyles()

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setScrollPosition(scrollLeft)
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", updateScrollButtons)
      updateScrollButtons()
      return () => container.removeEventListener("scroll", updateScrollButtons)
    }
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        if (canScrollRight) {
          scrollRight()
        } else if (scrollPosition > 0) {
          // Reset to beginning when reaching end
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              left: 0,
              behavior: "smooth"
            })
          }
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [canScrollRight, scrollPosition, isHovered])

  return (
    <section className="mb-16">
      {/* Section Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${variantStyles.gradient} shadow-lg`}>
            {variantStyles.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-2xl font-bold text-white ${variantStyles.titleColor}`}>
                {title}
              </h2>
              {variant !== "default" && (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${variantStyles.gradient} text-white`}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showViewAll && (
            <Link href="/products">
              <motion.button 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 flex items-center gap-1"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`bg-[#2a2a2a] border-gray-600 hover:bg-[#3a3a3a] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ${
                canScrollLeft ? "hover:shadow-lg" : ""
              }`}
              whileHover={canScrollLeft ? { scale: 1.05 } : {}}
              whileTap={canScrollLeft ? { scale: 0.95 } : {}}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`bg-[#2a2a2a] border-gray-600 hover:bg-[#3a3a3a] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ${
                canScrollRight ? "hover:shadow-lg" : ""
              }`}
              whileHover={canScrollRight ? { scale: 1.05 } : {}}
              whileTap={canScrollRight ? { scale: 0.95 } : {}}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10 pointer-events-none"></div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 relative"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                className="flex-none w-72"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Scroll Indicators */}
        {!canScrollLeft && (
          <motion.div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Start
          </motion.div>
        )}
        {!canScrollRight && (
          <motion.div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            End
          </motion.div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 flex justify-center">
        <div className="flex gap-1">
          {products.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(scrollPosition / 400) === index 
                  ? `bg-gradient-to-r ${variantStyles.gradient}` 
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}