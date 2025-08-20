"use client"

import { motion } from "framer-motion"
import { Smartphone, Gamepad2, Play, Coins, Target, Signal, ShoppingBag, Settings, Music } from "lucide-react"

export function CategoryIcons() {
  const categories = [
    { name: "iTunes", icon: Music, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { name: "PlayStation", icon: Gamepad2, color: "bg-gradient-to-br from-blue-600 to-blue-800" },
    { name: "STC", icon: Smartphone, color: "bg-gradient-to-br from-purple-600 to-purple-800" },
    { name: "Google Play", icon: Play, color: "bg-gradient-to-br from-green-500 to-green-700" },
    { name: "Razer Gold", icon: Coins, color: "bg-gradient-to-br from-yellow-500 to-orange-500" },
    { name: "PUBG", icon: Target, color: "bg-gradient-to-br from-orange-500 to-red-500" },
    { name: "Mobile & Data", icon: Signal, color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    { name: "Games", icon: Gamepad2, color: "bg-gradient-to-br from-indigo-500 to-purple-600" },
    { name: "Shopping", icon: ShoppingBag, color: "bg-gradient-to-br from-green-500 to-emerald-600" },
    { name: "Services", icon: Settings, color: "bg-gradient-to-br from-gray-600 to-gray-800" },
  ]

  return (
    <section className="py-8 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="flex justify-center space-x-8 overflow-x-auto pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.name}
                className="flex flex-col items-center min-w-[80px] cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className="h-8 w-8 text-white" />
                </motion.div>
                <span className="text-white text-sm text-center group-hover:text-blue-400 transition-colors">
                  {category.name}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
