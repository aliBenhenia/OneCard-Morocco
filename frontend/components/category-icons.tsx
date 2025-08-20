"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Smartphone, Gamepad2, Play, Coins, Target, Signal, ShoppingBag, Settings, Music, Wifi, Zap, Gift } from "lucide-react"

export function CategoryIcons() {
  const [showAll, setShowAll] = useState(false)
  const containerRef = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const categories = [
    { name: "iTunes", icon: Music, color: "bg-gradient-to-br from-purple-500 to-pink-500", popular: true },
    { name: "PlayStation", icon: Gamepad2, color: "bg-gradient-to-br from-blue-600 to-blue-800", popular: true },
    { name: "STC", icon: Smartphone, color: "bg-gradient-to-br from-purple-600 to-purple-800", popular: true },
    { name: "Google Play", icon: Play, color: "bg-gradient-to-br from-green-500 to-green-700", popular: true },
    { name: "Razer Gold", icon: Coins, color: "bg-gradient-to-br from-yellow-500 to-orange-500", popular: false },
    { name: "PUBG", icon: Target, color: "bg-gradient-to-br from-orange-500 to-red-500", popular: false },
    { name: "Mobile & Data", icon: Signal, color: "bg-gradient-to-br from-blue-500 to-cyan-500", popular: false },
    { name: "Games", icon: Gamepad2, color: "bg-gradient-to-br from-indigo-500 to-purple-600", popular: false },
    { name: "Shopping", icon: ShoppingBag, color: "bg-gradient-to-br from-green-500 to-emerald-600", popular: false },
    { name: "Services", icon: Settings, color: "bg-gradient-to-br from-gray-600 to-gray-800", popular: false },
    { name: "Internet", icon: Wifi, color: "bg-gradient-to-br from-cyan-500 to-blue-500", popular: false },
    { name: "Utilities", icon: Zap, color: "bg-gradient-to-br from-yellow-500 to-orange-500", popular: false },
    { name: "Gift Cards", icon: Gift, color: "bg-gradient-to-br from-pink-500 to-rose-500", popular: false },
  ]

  const displayedCategories = showAll ? categories : categories.slice(0, 8)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section className="py-12 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Browse Categories</h2>
          <p className="text-gray-400">Find the perfect digital gift card for any occasion</p>
        </motion.div>

        {/* Category Container */}
        <div ref={containerRef}>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {displayedCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.name}
                  className="flex flex-col items-center cursor-pointer group"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Category Card */}
                  <motion.div
                    className={`relative w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Icon */}
                    <IconComponent className="h-10 w-10 text-white relative z-10" />
                    
                    {/* Popular Badge */}
                    {category.popular && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        <span className="text-xs text-white font-bold">★</span>
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Category Name */}
                  <span className="text-white text-sm text-center font-medium group-hover:text-blue-400 transition-colors duration-300">
                    {category.name}
                  </span>
                  
                  {/* Hover Indicator */}
                  <motion.div
                    className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Show More/Less Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "Show More Categories"}
            <motion.span
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-2"
            >
              ▼
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}