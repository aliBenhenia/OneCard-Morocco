"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const slides = [
    {
      title: "Never run out again!",
      subtitle: "Top up your balance data in seconds",
      buttonText: "Recharge now",
      image: "https://placehold.co/600x400/8A2BE2/FFFFFF?text=STC+Cards",
      description: "Instant mobile recharge with the best rates"
    },
    {
      title: "Instant Digital Delivery",
      subtitle: "Get your cards delivered instantly to your email",
      buttonText: "Shop Now",
      image: "https://placehold.co/600x400/4169E1/FFFFFF?text=Netflix+Gift",
      description: "Entertainment cards delivered in seconds"
    },
    {
      title: "Best Prices Guaranteed",
      subtitle: "Save up to 15% on all digital cards",
      buttonText: "View Deals",
      image: "https://placehold.co/600x400/32CD32/FFFFFF?text=Amazon+Gift",
      description: "Exclusive discounts on top brands"
    },
    {
      title: "Gaming Power Up",
      subtitle: "Level up with gaming credits & subscriptions",
      buttonText: "Explore Gaming",
      image: "https://placehold.co/600x400/FF4500/FFFFFF?text=PlayStation+Plus",
      description: "All your gaming needs in one place"
    }
  ]

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
  }

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    startAutoPlay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [slides.length])

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
    startAutoPlay()
  }

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    startAutoPlay()
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    startAutoPlay()
  }

  return (
    <section className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 py-16 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-pink-500 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Slider Container */}
        <div 
          className="relative bg-gradient-to-br from-gray-900/30 to-gray-800/20 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white hover:bg-purple-600/50 transition-all duration-300 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white hover:bg-purple-600/50 transition-all duration-300 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slider Content */}
          <div className="relative h-[500px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? 1000 : -1000,
                    opacity: 0,
                    scale: 0.8
                  }),
                  center: {
                    zIndex: 1,
                    x: 0,
                    opacity: 1,
                    scale: 1
                  },
                  exit: (direction: number) => ({
                    zIndex: 0,
                    x: direction < 0 ? 1000 : -1000,
                    opacity: 0,
                    scale: 0.8
                  })
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 }
                }}
                className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between p-8 lg:p-16"
              >
                {/* Text Content */}
                <div className="flex-1 mb-12 lg:mb-0 max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-6"
                  >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                      {slides[currentSlide].title}
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                      {slides[currentSlide].subtitle}
                    </p>
                    
                    <p className="text-lg text-gray-300 max-w-lg">
                      {slides[currentSlide].description}
                    </p>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 mt-4">
                        {slides[currentSlide].buttonText}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Image Content */}
                <motion.div 
                  className="flex-1 flex justify-center items-center"
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="relative">
                    <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border-8 border-white/20">
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-xl flex items-center justify-center rotate-12">
                      <span className="text-white font-bold text-xl">50%</span>
                      <span className="absolute -bottom-2 text-white text-xs">OFF</span>
                    </div>
                    
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-xl flex items-center justify-center">
                      <span className="text-white font-bold">NEW</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { number: "1M+", label: "Happy Customers" },
            { number: "500+", label: "Digital Products" },
            { number: "24/7", label: "Support" },
            { number: "15%", label: "Average Savings" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-900/40 to-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center"
            >
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}