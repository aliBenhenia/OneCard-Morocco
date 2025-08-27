"use client"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { Star, ShoppingCart, Zap, Shield, Truck, RotateCcw, Heart, Minus, Plus, ChevronLeft, ChevronRight, Package, Award, RefreshCw, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import type { CartItem } from "@/contexts/cart-context"

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      <div>
        <div className="aspect-square bg-gray-700 rounded-2xl mb-4"></div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
      <div>
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="space-y-3 mb-8">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-700 rounded-lg"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="flex gap-4 mb-8">
          <div className="h-12 bg-gray-700 rounded-xl flex-1"></div>
          <div className="h-12 bg-gray-700 rounded-xl flex-1"></div>
        </div>
      </div>
    </div>
    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-3">
          <div className="h-32 bg-gray-700 rounded-lg mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
)

export default function ProductPage({ params }) {
  const { id } = params
  const { dispatch, state } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isClient, setIsClient] = useState(false)
  const [stock, setStock] = useState(15)
  const [descriptionKey, setDescriptionKey] = useState(0)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const mainImageRef = useRef(null)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  // Use useLayoutEffect to avoid hydration mismatch
  useLayoutEffect(() => {
    setIsClient(true)
    
    // Retrieve product info from localStorage
    const storedProduct = localStorage.getItem(`product_${id}`)
    if (storedProduct) {
      try {
        const productData = JSON.parse(storedProduct)
        
        // Generate additional mock images
        const mockImages = [
          productData.image,
          `https://placehold.co/600x600/3b82f6/FFFFFF?text=${encodeURIComponent(productData.name)}+1`,
          `https://placehold.co/600x600/ef4444/FFFFFF?text=${encodeURIComponent(productData.name)}+2`,
          `https://placehold.co/600x600/10b981/FFFFFF?text=${encodeURIComponent(productData.name)}+3`,
          `https://placehold.co/600x600/8b5cf6/FFFFFF?text=${encodeURIComponent(productData.name)}+4`,
          `https://placehold.co/600x600/f59e0b/FFFFFF?text=${encodeURIComponent(productData.name)}+5`,
          `https://placehold.co/600x600/ec4899/FFFFFF?text=${encodeURIComponent(productData.name)}+6`
        ]
        
        setProduct({ ...productData, images: mockImages })
      } catch (error) {
        console.error("Error parsing product data:", error)
      }
    }

    // Load recently viewed products
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      setRecentlyViewed(viewed)
    } catch (error) {
      console.error("Error loading recently viewed products:", error)
      setRecentlyViewed([])
    }
  }, [id])

  // Save to recently viewed
  useEffect(() => {
    if (product && isClient) {
      try {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        const updated = [product, ...viewed.filter(p => p && p.id !== (product.id || null))].slice(0, 8)
        localStorage.setItem('recentlyViewed', JSON.stringify(updated))
        setRecentlyViewed(updated)
      } catch (error) {
        console.error("Error saving recently viewed products:", error)
      }
    }
  }, [product, isClient])

  const isInCart = state?.items?.some((item) => item.id === product?.id) || false
  const itemQuantity = state?.items?.find((item) => item.id === product?.id)?.quantity || 0

  const handleAddToCart = () => {
    if (!product) return
    
    setIsAdding(true)
    
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    }
    
    try {
      dispatch({ type: "ADD_ITEM", payload: item })
    } catch (error) {
      console.error("Error adding item to cart:", error)
    }

    // Reset quantity after adding to cart
    setQuantity(1)
    
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleBuyNow = () => {
    // Add to cart and redirect to checkout
    handleAddToCart()
    // In a real app, you would redirect to checkout page
    // router.push('/checkout')
  }

  const generateDescription = () => {
    if (!product) return ""
    
    const descriptions = [
      `Experience the future with the ${product.name}. This cutting-edge device combines premium materials with advanced technology to deliver an unparalleled user experience. Crafted with precision and designed for performance, it's the perfect companion for your daily needs.`,
      `The ${product.name} features a sleek design that fits seamlessly into your lifestyle. With its intuitive interface and powerful capabilities, it simplifies complex tasks while delivering exceptional results every time.`,
      `Engineered for excellence, the ${product.name} offers reliability and innovation in one elegant package. Whether you're a professional or casual user, this device adapts to your needs and exceeds expectations.`,
      `Discover the perfect blend of form and function with the ${product.name}. Its premium construction ensures durability, while its smart features make it an indispensable tool for modern living.`
    ]
    
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  const mockReviews = [
    {
      id: 1,
      name: "Alex Johnson",
      rating: 5,
      date: "2023-10-15",
      comment: "Absolutely love this product! It exceeded all my expectations. The quality is top-notch and it works perfectly.",
      verified: true
    },
    {
      id: 2,
      name: "Sarah Williams",
      rating: 4,
      date: "2023-09-22",
      comment: "Great product overall. Easy to use and very reliable. The only minor issue is the battery life could be better.",
      verified: true
    },
    {
      id: 3,
      name: "Michael Chen",
      rating: 5,
      date: "2023-11-05",
      comment: "Outstanding quality and performance. I've been using it for months and it still works like new. Highly recommended!",
      verified: true
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      rating: 4,
      date: "2023-08-30",
      comment: "Very satisfied with my purchase. The build quality is excellent and it looks even better in person than in the photos.",
      verified: false
    },
    {
      id: 5,
      name: "David Kim",
      rating: 5,
      date: "2023-12-12",
      comment: "This product has completely transformed my workflow. The attention to detail is remarkable and the performance is flawless.",
      verified: true
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  // Handle quantity changes with stock validation
  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, Math.min(newQuantity, stock)))
  }

  // Handle image navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % (product?.images?.length || 1))
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1))
  }

  // Handle thumbnail click with animation
  const handleThumbnailClick = (index) => {
    setSelectedImage(index)
  }

  // Handle image zoom
  const handleImageZoom = (e) => {
    if (isImageZoomed) {
      setIsImageZoomed(false)
      return
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
    setIsImageZoomed(true)
  }

  // Open lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index)
    setShowLightbox(true)
  }

  // Close lightbox
  const closeLightbox = () => {
    setShowLightbox(false)
  }

  // Navigate lightbox images
  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % (product?.images?.length || 1))
  }

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1))
  }

  // Handle lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return
      
      if (e.key === 'ArrowRight') {
        nextLightboxImage()
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage()
      } else if (e.key === 'Escape') {
        closeLightbox()
      }
    }

    if (showLightbox) {
      window.addEventListener('keydown', handleKeyDown)
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLightbox])

  // Show skeleton loader while hydrating
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <SkeletonLoader />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Product not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <motion.div 
          className="text-sm text-gray-400 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Home / {product.category} / {product.name}
        </motion.div>

        {/* Product Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div 
              ref={mainImageRef}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-800 mb-4 shadow-2xl cursor-zoom-in"
              onClick={handleImageZoom}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedImage}-${product.id}`}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${isImageZoomed ? 'scale-150' : 'scale-100'}`}
                  style={isImageZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: isImageZoomed ? 1.5 : 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 shadow-lg transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 shadow-lg transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                {selectedImage + 1} / {product.images.length}
              </div>
              
              {/* Wishlist Button */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <Heart 
                  className={`h-6 w-6 cursor-pointer transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-white hover:text-red-400'}`} 
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLiked(!isLiked)
                  }}
                />
              </div>
              
              {/* Fullscreen Button */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <Globe 
                  className="h-6 w-6 cursor-pointer text-white hover:text-blue-400 transition-colors" 
                  onClick={(e) => {
                    e.stopPropagation()
                    openLightbox(selectedImage)
                  }}
                />
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="relative">
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {product.images.map((img, index) => (
                  <motion.div
                    key={`${index}-${product.id}`}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all relative ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-500/30' 
                        : 'border-transparent hover:border-gray-600'
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    {selectedImage === index && (
                      <motion.div
                        className="absolute inset-0 border-2 border-white rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                  <div className="flex mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-gray-300 text-sm">({product.reviewCount})</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                {product.discount && (
                  <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2 py-1 rounded">
                    Save {product.discount}%
                  </span>
                )}
              </div>
              
              <div className="mb-8">
                <p className="text-gray-300 mb-4 leading-relaxed" key={descriptionKey}>
                  {generateDescription()}
                </p>
              </div>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <motion.div 
                  className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Shield className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">2 Year Warranty</span>
                </motion.div>
                <motion.div 
                  className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Truck className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Free Shipping</span>
                </motion.div>
                <motion.div 
                  className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <RotateCcw className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">30-Day Returns</span>
                </motion.div>
                <motion.div 
                  className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Zap className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Fast Delivery</span>
                </motion.div>
                <motion.div 
                  className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Package className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Premium Packaging</span>
                </motion.div>
                <motion.div 
                  className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Award className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Quality Guaranteed</span>
                </motion.div>
                <motion.div 
                  className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <RefreshCw className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Lifetime Updates</span>
                </motion.div>
              </div>
              
              {/* Stock Information */}
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-800/30 to-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-400" />
                    Availability:
                  </span>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${stock > 10 ? 'bg-green-500' : stock > 5 ? 'bg-yellow-500' : stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                    <span className={stock > 10 ? 'text-green-400' : stock > 5 ? 'text-yellow-400' : stock > 0 ? 'text-orange-400' : 'text-red-400'}>
                      {stock > 10 ? 'In Stock' : stock > 5 ? 'Limited Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                {stock > 0 && stock <= 10 && (
                  <div className="mt-2 text-sm text-orange-400 flex items-center">
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Order soon to avoid stock issues
                  </div>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gradient-to-r from-gray-800/30 to-gray-800/50 rounded-xl border border-gray-700/50">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                  <button 
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-30"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium w-12 text-center">{quantity}</span>
                  <button 
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-30"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-gray-400 text-sm">
                  ${(product.price * quantity).toFixed(2)} total
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding || stock === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAdding ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        Adding to Cart...
                      </motion.span>
                    ) : isInCart ? (
                      `Update Cart (${itemQuantity})`
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleBuyNow}
                    disabled={stock === 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Buy Now
                  </Button>
                </motion.div>
              </div>
              
              {/* Security Info */}
              <div className="flex items-center text-sm text-gray-400 border-t border-gray-800 pt-6">
                <Shield className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                <span>Secure checkout with 256-bit SSL encryption</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Product Details Tabs */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="border-b border-gray-800 mb-8">
            <div className="flex flex-wrap gap-6">
              <button
                className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'description' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
                {activeTab === 'description' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="tab-indicator"
                  />
                )}
              </button>
              <button
                className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'specifications' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
                {activeTab === 'specifications' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="tab-indicator"
                  />
                )}
              </button>
              <button
                className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'reviews' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({mockReviews.length})
                {activeTab === 'reviews' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="tab-indicator"
                  />
                )}
              </button>
            </div>
          </div>
          
          <div className="py-6">
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                    {generateDescription()}
                  </p>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    The {product.name} is designed with the modern user in mind. Its intuitive interface makes it easy to use for both beginners and experts. The premium materials ensure durability while maintaining a sleek aesthetic.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    With advanced features and reliable performance, this product is built to last. Whether you're using it for work or leisure, you'll appreciate the thoughtful design and attention to detail that went into every aspect of this device.
                  </p>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                      <h3 className="text-xl font-bold mb-4 text-blue-400">Key Benefits</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Enhanced performance with optimized efficiency</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Ergonomic design for comfortable extended use</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Advanced security features for peace of mind</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Seamless integration with modern technology</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                      <h3 className="text-xl font-bold mb-4 text-green-400">What's in the Box</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>1x {product.name} Main Device</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>1x Premium Charging Cable</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>1x Quick Start Guide</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>1x Protective Case</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>2-Year Warranty Card</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'specifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-semibold mb-6 text-blue-400 flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Technical Specifications
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Model</span>
                        <span className="font-medium">{product.name}</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Dimensions</span>
                        <span className="font-medium">15.2 x 8.1 x 0.8 cm</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Weight</span>
                        <span className="font-medium">245g</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Material</span>
                        <span className="font-medium">Aluminum Alloy</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Color Options</span>
                        <span className="font-medium">Space Gray, Silver, Gold</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Water Resistance</span>
                        <span className="font-medium">IP67</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-semibold mb-6 text-blue-400 flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Performance
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Battery Life</span>
                        <span className="font-medium">Up to 24 hours</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Connectivity</span>
                        <span className="font-medium">Bluetooth 5.2, Wi-Fi 6</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Processor</span>
                        <span className="font-medium">Octa-core 2.8 GHz</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Storage</span>
                        <span className="font-medium">128GB / 256GB</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">RAM</span>
                        <span className="font-medium">8GB LPDDR5</span>
                      </li>
                      <li className="flex justify-between pb-3 border-b border-gray-700">
                        <span className="text-gray-400">Display</span>
                        <span className="font-medium">6.1" OLED, 120Hz</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 bg-gradient-to-br from-gray-800/30 to-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-6 text-purple-400">Compatibility</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['iOS 14+', 'Android 10+', 'Windows 10+', 'macOS 11+'].map((item, index) => (
                      <div key={index} className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <h3 className="text-2xl font-bold">Customer Reviews</h3>
                  <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                    <div className="flex mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-lg font-medium mr-1">{product.rating}.0</span>
                    <span className="text-gray-400">({product.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h4 className="font-bold mb-4">Rating Distribution</h4>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <div className="w-12 text-gray-400">{rating} star</div>
                          <div className="flex-1 mx-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full" 
                              style={{ width: `${rating === 5 ? 65 : rating === 4 ? 20 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%` }}
                            ></div>
                          </div>
                          <div className="w-10 text-right text-gray-400">
                            {rating === 5 ? '65%' : rating === 4 ? '20%' : rating === 3 ? '10%' : rating === 2 ? '3%' : '2%'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <h4 className="font-bold mb-4">Write a Review</h4>
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2">Your Rating</label>
                      <div className="flex">
                        {renderStars(0)}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2">Your Review</label>
                      <textarea 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Share your experience with this product..."
                      ></textarea>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Submit Review
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <motion.div 
                      key={review.id}
                      className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:from-gray-800/40 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-wrap justify-between gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{review.name}</h4>
                          <div className="flex items-center mt-1">
                            <div className="flex mr-2">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-400">{review.date}</span>
                          </div>
                        </div>
                        {review.verified && (
                          <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <button className="flex items-center mr-4 hover:text-blue-400 transition-colors">
                          <Zap className="h-4 w-4 mr-1" />
                          Helpful
                        </button>
                        <button className="flex items-center hover:text-blue-400 transition-colors">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Report
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentlyViewed.slice(0, 6).map((item, index) => (
                <motion.div 
                  key={`${item.id}-${index}`}
                  className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 rounded-xl p-3 hover:from-gray-800/40 transition-all cursor-pointer group border border-gray-700/50"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-gray-700 rounded-lg h-32 mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-400 transition-colors truncate">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-bold">${item.price.toFixed(2)}</span>
                    <div className="flex">
                      {renderStars(4)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div 
                key={item} 
                className="bg-gradient-to-br from-gray-800/30 to-gray-800/50 rounded-xl p-3 hover:from-gray-800/40 transition-all cursor-pointer group border border-gray-700/50"
                whileHover={{ y: -5 }}
              >
                <div className="bg-gray-700 rounded-lg h-32 mb-3 flex items-center justify-center overflow-hidden">
                  <div className="bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-dashed rounded-xl w-12 h-12 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-400 transition-colors">Related Product {item}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-bold">${(Math.random() * 100 + 50).toFixed(2)}</span>
                  <div className="flex">
                    {renderStars(4)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10 hover:bg-black/70 transition-colors"
                onClick={closeLightbox}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-3 z-10 hover:bg-black/70 transition-colors"
                onClick={prevLightboxImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-3 z-10 hover:bg-black/70 transition-colors"
                onClick={nextLightboxImage}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={product.images[lightboxIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                {lightboxIndex + 1} / {product.images.length}
              </div>
              
              <div className="mt-4 flex justify-center gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={`${index}-lightbox`}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === lightboxIndex ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent'
                    }`}
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}