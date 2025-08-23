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

  // Play sound effect
  const playHoverSound = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  const playClickSound = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            Browse Categories
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Find the perfect digital gift card for any occasion
          </motion.p>
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
                  whileHover={{ y: -12, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={playHoverSound}
                  onClick={playClickSound}
                >
                  {/* Category Card */}
                  <motion.div
                    className={`relative w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                    whileHover={{ 
                      scale: 1.15,
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon */}
                    <IconComponent className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                    
                    {/* Popular Badge */}
                    {category.popular && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      >
                        <span className="text-xs text-white font-bold">★</span>
                      </motion.div>
                    )}
                    
                    {/* Glow Effect */}
                    <motion.div 
                      className={`absolute inset-0 rounded-2xl ${category.color} opacity-0 group-hover:opacity-30 blur-xl -z-10`}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  {/* Category Name */}
                  <motion.span 
                    className="text-white text-sm text-center font-medium group-hover:text-blue-400 transition-colors duration-300 mt-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {category.name}
                  </motion.span>
                  
                  {/* Hover Indicator */}
                  <motion.div
                    className="w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 group-hover:w-full transition-all duration-500"
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
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center mx-auto group"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClickSound()
              setShowAll(!showAll)
            }}
          >
            <span className="mr-2">{showAll ? "Show Less" : "Show More Categories"}</span>
            <motion.span
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              ▼
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  )
}