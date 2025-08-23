"use client"

import { ShoppingCart, Plus, Star, Shield, Heart, Zap, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import type { CartItem } from "@/contexts/cart-context"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ProductCardProps {
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
  deliveryTime?: string
  stock?: number
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  category,
  discount,
  badge,
  trending,
  featured,
  deliveryTime = "Instant",
  stock = 999,
}: ProductCardProps) {
  const { dispatch, state } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [flyAnimation, setFlyAnimation] = useState({
    isVisible: false,
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 }
  })
  
  const cardRef = useRef<HTMLDivElement>(null)
  const cartIconRef = useRef<HTMLDivElement>(null)

  // Get cart icon position for animation
  useEffect(() => {
    const updateCartPosition = () => {
      if (typeof window !== 'undefined') {
        const cartElement = document.querySelector('[data-cart-icon]')
        if (cartElement) {
          const rect = cartElement.getBoundingClientRect()
          setFlyAnimation(prev => ({
            ...prev,
            endPosition: {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            }
          }))
        }
      }
    }

    updateCartPosition()
    window.addEventListener('resize', updateCartPosition)
    return () => window.removeEventListener('resize', updateCartPosition)
  }, [])

  const playAddSound = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  const isInCart = state.items.some((item) => item.id === id)
  const itemQuantity = state.items.find((item) => item.id === id)?.quantity || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    // Get position of clicked button
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const startX = rect.left + rect.width / 2
    const startY = rect.top + rect.height / 2
    
    setFlyAnimation({
      isVisible: true,
      startPosition: { x: startX, y: startY },
      endPosition: flyAnimation.endPosition
    })
    
    playAddSound()
    setIsAdding(true)
    
    const item: Omit<CartItem, "quantity"> = {
      id,
      name,
      price,
      image,
      category,
    }
    dispatch({ type: "ADD_ITEM", payload: item })

    setTimeout(() => {
      setIsAdding(false)
      setFlyAnimation(prev => ({ ...prev, isVisible: false }))
    }, 1000)
  }

  const handleRemoveFromCart = () => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const getStockStatus = () => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-400" }
    if (stock < 10) return { text: `Only ${stock} left`, color: "text-orange-400" }
    return { text: "In Stock", color: "text-green-400" }
  }

  const stockStatus = getStockStatus()

  return (
    <motion.div 
      ref={cardRef}
      className="relative"
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      onHoverStart={() => setShowQuickView(true)}
      onHoverEnd={() => setShowQuickView(false)}
    >
      {/* Flying Cart Animation */}
      <AnimatePresence>
        {flyAnimation.isVisible && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            initial={{
              x: flyAnimation.startPosition.x,
              y: flyAnimation.startPosition.y,
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: flyAnimation.endPosition.x,
              y: flyAnimation.endPosition.y,
              opacity: 0,
              scale: 0.3
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut"
            }}
            onAnimationComplete={() => setFlyAnimation(prev => ({ ...prev, isVisible: false }))}
          >
            <div className="bg-blue-500 rounded-full p-2 shadow-lg">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Overlay */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-2 right-2 z-20"
          >
            <Button
              size="sm"
              className="bg-white/90 hover:bg-white text-black text-xs px-3 py-1 h-8 rounded-full shadow-lg"
            >
              Quick View
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-xl">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {discount && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg">
              -{discount}%
            </Badge>
          )}
          {featured && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {trending && (
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg">
              <Zap className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          {badge && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
              {badge}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-200"
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} 
          />
        </motion.button>

        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative overflow-hidden">
            <motion.img
              src={image || "/placeholder.svg"}
              alt={name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Security Badge */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center text-xs">
              <Shield className="h-3 w-3 text-green-400 mr-1" />
              <span className="text-white">Secured 99.9%</span>
            </div>

            {/* Rating */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
              <span className="text-white text-xs font-medium">{rating}</span>
              <span className="text-gray-400 text-xs ml-1">({reviewCount})</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-4">
            {/* Category */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300 hover:bg-gray-600">
                {category}
              </Badge>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {deliveryTime}
              </div>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-white text-base line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
              {name}
            </h3>

            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-white text-xl">{price.toFixed(2)} ₽</span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">{originalPrice.toFixed(2)} ₽</span>
                )}
              </div>
              {originalPrice && discount && (
                <span className="text-green-400 text-sm font-medium">
                  Save {(originalPrice - price).toFixed(2)} ₽
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center text-xs">
              <div className={`flex items-center ${stockStatus.color}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${stockStatus.color.includes('red') ? 'bg-red-400' : stockStatus.color.includes('orange') ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                {stockStatus.text}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Add to Cart Button */}
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isInCart ? (
                  <div className="flex items-center bg-blue-600 rounded-lg overflow-hidden">
                    <Button
                      onClick={handleRemoveFromCart}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 h-10 rounded-none"
                      size="sm"
                    >
                      -
                    </Button>
                    <span className="text-white px-3 font-medium">{itemQuantity}</span>
                    <Button
                      onClick={handleAddToCart}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-none"
                      size="sm"
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        "+"
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding || stock === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm py-2 px-4 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isAdding ? "Adding..." : stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                )}
              </motion.div>

              {/* Quick Add Button */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="sm"
                  className="p-2 border-gray-600 text-gray-400 hover:text-white hover:border-blue-500 bg-transparent hover:bg-blue-600/20 rounded-lg"
                  disabled={isAdding || stock === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none"></div>
      </Card>
    </motion.div>
  )
}