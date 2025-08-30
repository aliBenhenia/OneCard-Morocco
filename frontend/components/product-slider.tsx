import { ShoppingCart, Plus, Star, Shield, Heart, Zap, Award, Clock, Eye, Share2, Tag, Users, Truck, Battery, Camera, Palette, Code, Book, Dumbbell, Plane, Car, Building, Crown, Minus, Package, RefreshCw, Gift, TrendingUp, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useState, useRef, useEffect } from "react"

// Mock cart context for demonstration
const useCart = () => {
  const [state, setState] = useState({ items: [] })
  
  const dispatch = (action) => {
    if (action.type === "ADD_ITEM") {
      setState(prev => ({
        items: [...prev.items, { ...action.payload, quantity: 1 }]
      }))
    } else if (action.type === "REMOVE_ITEM") {
      setState(prev => ({
        items: prev.items.filter(item => item.id !== action.payload)
      }))
    }
  }
  
  return { state, dispatch }
}

// Mock Button component
const Button = ({ children, className, onClick, disabled, size = "default", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md"
  }
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground"
  }
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ""}`
  
  return (
    <button className={classes} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

// Mock Card component
const Card = ({ children, className, ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ""}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 pt-0 ${className || ""}`} {...props}>
    {children}
  </div>
)

// Mock Badge component
const Badge = ({ children, className, variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border"
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className || ""}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

// Utility function for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ')

// Motion mock for animations
const motion = {
  div: ({ children, whileHover, whileTap, transition, onHoverStart, onHoverEnd, className, ...props }) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  img: ({ src, alt, className, whileHover, transition }) => (
    <img src={src} alt={alt} className={className} />
  ),
  button: ({ children, whileHover, whileTap, className, ...props }) => (
    <button className={className} {...props}>
      {children}
    </button>
  )
}

const AnimatePresence = ({ children }) => <>{children}</>

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
  new?: boolean
  limited?: boolean
  exclusive?: boolean
  popular?: boolean
  description?: string
  tags?: string[]
  sold?: number
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
  new: isNew,
  limited,
  exclusive,
  popular,
  description,
  tags = [],
  sold = 0,
}: ProductCardProps) {
  const { dispatch, state } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [flyAnimation, setFlyAnimation] = useState({
    isVisible: false,
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 }
  })
  
  const cardRef = useRef(null)
  const cartIconRef = useRef(null)

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
      try {
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
      } catch (e) {
        console.log("Audio not supported")
      }
    }
  }

  const playClickSound = () => {
    if (typeof window !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (e) {
        console.log("Audio not supported")
      }
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
    
    const item = {
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

  const handleBuyNow = () => {
    // Store complete product info in localStorage
    const productInfo = {
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
      deliveryTime,
      stock,
      new: isNew,
      limited,
      exclusive,
      popular,
      description,
      tags,
      sold
    }
    
    console.log("Product info:", productInfo)
    alert(`Buying now: ${name}`)
  }

  const handleRemoveFromCart = () => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const getStockStatus = () => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-400", icon: AlertCircle }
    if (stock < 10) return { text: `Only ${stock} left`, color: "text-orange-400", icon: Info }
    return { text: "In Stock", color: "text-green-400", icon: CheckCircle }
  }

  const stockStatus = getStockStatus()

  // Enhanced badge component
  const BadgeComponent = ({ children, className, icon: Icon }: { children: React.ReactNode; className?: string; icon?: React.ElementType }) => (
    <Badge className={cn("text-[10px] px-2 py-1 rounded-full flex items-center shadow-md", className)}>
      {Icon && <Icon className="h-2.5 w-2.5 mr-1" />}
      {children}
    </Badge>
  )

  // Responsive card width classes
  const getCardWidthClass = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width < 640) return "w-48" // sm screens
      if (width < 768) return "w-56" // md screens
      if (width < 1024) return "w-60" // lg screens
      return "w-64" // xl and up
    }
    return "w-64" // default
  }

  // Get category icon
  const getCategoryIcon = () => {
    const categoryIcons = {
      electronics: Battery,
      camera: Camera,
      art: Palette,
      software: Code,
      books: Book,
      fitness: Dumbbell,
      travel: Plane,
      automotive: Car,
      real_estate: Building,
      default: Package
    }
    
    return categoryIcons[category.toLowerCase().replace(/\s+/g, '_')] || categoryIcons.default
  }

  const CategoryIcon = getCategoryIcon()

  return (
    <div 
      ref={cardRef}
      className={cn("relative", getCardWidthClass())}
    >
      {/* Flying Cart Animation */}
      {flyAnimation.isVisible && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: flyAnimation.startPosition.x,
            top: flyAnimation.startPosition.y,
            transform: 'translate(-50%, -50%)',
            animation: 'flyToCart 0.8s ease-in-out forwards'
          }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 shadow-lg">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      {/* Quick View Overlay */}
      {showQuickView && (
        <div className="absolute top-2 right-2 z-20">
          <Button
            size="sm"
            className="bg-white/90 hover:bg-white text-black text-[10px] px-2 py-1 h-7 rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              playClickSound()
              alert(`Viewing product: ${name}`)
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-xl">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {discount && (
            <BadgeComponent className="bg-gradient-to-r from-red-500 to-pink-500 text-white" icon={Tag}>
              -{discount}%
            </BadgeComponent>
          )}
          {featured && (
            <BadgeComponent className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white" icon={Award}>
              Featured
            </BadgeComponent>
          )}
          {trending && (
            <BadgeComponent className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white" icon={TrendingUp}>
              Trending
            </BadgeComponent>
          )}
          {isNew && (
            <BadgeComponent className="bg-gradient-to-r from-green-500 to-emerald-500 text-white" icon={Tag}>
              New
            </BadgeComponent>
          )}
          {limited && (
            <BadgeComponent className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" icon={Star}>
              Limited
            </BadgeComponent>
          )}
          {exclusive && (
            <BadgeComponent className="bg-gradient-to-r from-rose-500 to-red-500 text-white" icon={Crown}>
              Exclusive
            </BadgeComponent>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-pink-500/50 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
            playClickSound()
          }}
        >
          <Heart 
            className={`h-3.5 w-3.5 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} 
          />
        </button>

        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative overflow-hidden">
            <img
              src={image || "https://placehold.co/300x200/333333/ffffff?text=Product"}
              alt={name}
              className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Security Badge */}
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-1 flex items-center text-[10px]">
              <Shield className="h-2.5 w-2.5 text-green-400 mr-1" />
              <span className="text-white">Secured</span>
            </div>

            {/* Rating */}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-1 flex items-center">
              <Star className="h-2.5 w-2.5 text-yellow-400 fill-current mr-1" />
              <span className="text-white text-[10px] font-medium">{rating}</span>
              <span className="text-gray-400 text-[10px] ml-1">({reviewCount})</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-3 space-y-3">
            {/* Category and Delivery */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-[10px] bg-gray-700 text-gray-300 hover:bg-gray-600 px-2 py-0.5 flex items-center">
                <CategoryIcon className="h-2.5 w-2.5 mr-1" />
                {category}
              </Badge>
              <div className="flex items-center text-[10px] text-gray-400">
                <Clock className="h-2.5 w-2.5 mr-1" />
                {deliveryTime}
              </div>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
              {name}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-gray-400 text-xs line-clamp-2">
                {description}
              </p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-[9px] bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-bold text-white text-lg">{price.toFixed(2)} ₽</span>
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through">{originalPrice.toFixed(2)} ₽</span>
                )}
              </div>
              {originalPrice && discount && (
                <span className="text-green-400 text-xs font-medium">
                  Save {(originalPrice - price).toFixed(2)} ₽
                </span>
              )}
            </div>

            {/* Stock Status and Sold */}
            <div className="flex items-center justify-between text-[10px]">
              <div className={`flex items-center ${stockStatus.color}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${stockStatus.color.includes('red') ? 'bg-red-400' : stockStatus.color.includes('orange') ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                {stockStatus.text}
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="h-2.5 w-2.5 mr-1" />
                <span>{sold} sold</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-1.5">
              {/* Add to Cart Button */}
              <div className="w-full">
                {isInCart ? (
                  <div className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFromCart()
                        playClickSound()
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 h-8 rounded-none"
                      size="sm"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-white px-2 font-medium text-sm">{itemQuantity}</span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(e)
                        playClickSound()
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 h-8 rounded-none"
                      size="sm"
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <div className="animate-spin">
                          <RefreshCw className="h-3 w-3" />
                        </div>
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(e)
                      playClickSound()
                    }}
                    disabled={isAdding || stock === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs py-1.5 px-3 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                    size="sm"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1.5" />
                    {isAdding ? "Adding..." : stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                )}
              </div>

              {/* Action Icons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  className="flex items-center text-gray-400 hover:text-blue-400 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    playClickSound()
                    alert(`Viewing product: ${name}`)
                  }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  <span>View</span>
                </button>
                
                <button
                  className="flex items-center text-gray-400 hover:text-green-400 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBuyNow()
                    playClickSound()
                  }}
                >
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  <span>Buy Now</span>
                </button>
                
                <button
                  className="flex items-center text-gray-400 hover:text-purple-400 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    playClickSound()
                    alert(`Sharing product: ${name}`)
                  }}
                >
                  <Share2 className="h-3.5 w-3.5 mr-1" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none"></div>
      </Card>
      
      <style jsx>{`
        @keyframes flyToCart {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(${flyAnimation.endPosition.x - flyAnimation.startPosition.x}px - 50%), 
              calc(${flyAnimation.endPosition.y - flyAnimation.startPosition.y}px - 50%)
            ) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Demo App Component
export default function App() {
  const sampleProducts = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image: "https://placehold.co/300x200/4f46e5/ffffff?text=Headphones",
      rating: 4.8,
      reviewCount: 124,
      category: "Electronics",
      discount: 25,
      trending: true,
      featured: true,
      deliveryTime: "2 days",
      stock: 15,
      new: true,
      description: "High-quality wireless headphones with noise cancellation",
      tags: ["wireless", "noise-cancelling", "premium"],
      sold: 342
    },
    {
      id: "2",
      name: "Professional Camera Lens",
      price: 899.99,
      originalPrice: 1199.99,
      image: "https://placehold.co/300x200/059669/ffffff?text=Camera",
      rating: 4.9,
      reviewCount: 89,
      category: "Camera",
      discount: 25,
      exclusive: true,
      deliveryTime: "Instant",
      stock: 5,
      limited: true,
      description: "Professional-grade camera lens for stunning photography",
      tags: ["professional", "photography", "high-quality"],
      sold: 156
    },
    {
      id: "3",
      name: "Fitness Tracker Watch",
      price: 149.99,
      originalPrice: 199.99,
      image: "https://placehold.co/300x200/dc2626/ffffff?text=Fitness",
      rating: 4.6,
      reviewCount: 203,
      category: "Fitness",
      discount: 25,
      popular: true,
      deliveryTime: "1 day",
      stock: 42,
      description: "Advanced fitness tracker with heart rate monitoring",
      tags: ["fitness", "health", "smartwatch"],
      sold: 512
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Premium Products</h1>
          <div className="flex items-center space-x-4">
            <div className="relative" data-cart-icon>
              <ShoppingCart className="h-6 w-6 text-white" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  )
}