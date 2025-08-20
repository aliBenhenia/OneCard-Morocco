"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Never run out again!",
      subtitle: "Top up your balance data in seconds",
      buttonText: "Recharge now",
      cards: [
        { id: 1, text: "STC", color: "bg-purple-800", rotation: "rotate-12", position: "-top-4 -left-8" },
        { id: 2, text: "💳", color: "bg-blue-500", rotation: "-rotate-6", position: "top-0 right-0" },
        { id: 3, text: "CARD", color: "bg-gray-900", rotation: "rotate-3", position: "relative" }
      ]
    },
    {
      title: "Instant Digital Delivery",
      subtitle: "Get your cards delivered instantly to your email",
      buttonText: "Shop Now",
      cards: [
        { id: 4, text: "NETFLIX", color: "bg-red-600", rotation: "rotate-6", position: "-top-2 -left-6" },
        { id: 5, text: "🎮", color: "bg-purple-600", rotation: "-rotate-12", position: "top-2 right-2" },
        { id: 6, text: "GIFT", color: "bg-gradient-to-r from-pink-500 to-rose-500", rotation: "rotate-2", position: "relative" }
      ]
    },
    {
      title: "Best Prices Guaranteed",
      subtitle: "Save up to 15% on all digital cards",
      buttonText: "View Deals",
      cards: [
        { id: 7, text: "AMAZON", color: "bg-yellow-500", rotation: "-rotate-6", position: "-top-3 -left-10" },
        { id: 8, text: "📱", color: "bg-green-500", rotation: "rotate-12", position: "top-1 right-1" },
        { id: 9, text: "SALE", color: "bg-gradient-to-r from-blue-500 to-cyan-500", rotation: "-rotate-3", position: "relative" }
      ]
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 py-16 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
        {/* Text Content */}
        <motion.div 
          className="flex-1 mb-12 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {slides[currentSlide].title.split(' ')[0]}
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {slides[currentSlide].title.split(' ').slice(1).join(' ')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-800 mb-2">
                {slides[currentSlide].subtitle.split(' ')[0]} {slides[currentSlide].subtitle.split(' ')[1]}
              </p>
              <p className="text-xl md:text-2xl text-gray-800 mb-2">
                {slides[currentSlide].subtitle.split(' ').slice(2).join(' ')}
              </p>
              <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-8">
                {slides[currentSlide].subtitle.split(' ').slice(4).join(' ')}
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  {slides[currentSlide].buttonText}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="flex space-x-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-gray-800 scale-125' : 'bg-gray-800/50'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Card Animation */}
        <motion.div 
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {slides[currentSlide].cards.map((card) => (
                  <motion.div
                    key={card.id}
                    className={`w-24 h-16 md:w-32 md:h-20 ${card.color} rounded-lg transform ${card.rotation} ${card.position} shadow-2xl flex items-center justify-center cursor-pointer`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: card.id * 0.1 }}
                  >
                    <span className="text-white font-bold text-sm md:text-base">{card.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 right-10 w-4 h-4 bg-white rounded-full opacity-30"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-6 h-6 bg-white rounded-full opacity-20"
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-3 h-3 bg-white rounded-full opacity-40"
        animate={{
          x: [0, 15, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  )
}