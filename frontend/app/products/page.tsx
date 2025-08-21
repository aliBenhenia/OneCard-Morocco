// ```jsx
"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Star, 
  ShoppingCart, 
  Eye, 
  FilterX,
  X,
  Tag,
  TrendingUp,
  Clock,
  Heart,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Whatsapp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useCart } from "@/contexts/cart-context"
import { ProductCardSkeleton, ProductListSkeleton } from "@/components/skeleton-loader"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  discount?: number
  isPopular?: boolean
  isNew?: boolean
  isFeatured?: boolean
}

const allProducts: Product[] = [
  {
    id: 1,
    name: "Amazon (US) Gift Card - USD 50",
    price: 195,
    originalPrice: 220,
    image: "/amazon-gift-card-orange.png",
    category: "Shopping",
    rating: 4.8,
    reviews: 1247,
    discount: 11,
    isPopular: true,
    isFeatured: true,
  },
  {
    id: 2,
    name: "Apple & iTunes Giftcard $100 (US Store)",
    price: 363,
    originalPrice: 400,
    image: "/itunes-gift-card-pink.png",
    category: "Entertainment",
    rating: 4.9,
    reviews: 892,
    discount: 9,
    isPopular: true,
  },
  {
    id: 3,
    name: "Razer Gold - $100 (Global)",
    price: 355,
    originalPrice: 375,
    image: "/razer-gold-card.png",
    category: "Gaming",
    rating: 4.7,
    reviews: 634,
    discount: 5,
    isFeatured: true,
  },
  {
    id: 4,
    name: "PlayStation Network $100 USD",
    price: 365,
    image: "/generic-game-store-gift-card.png",
    category: "Gaming",
    rating: 4.8,
    reviews: 1156,
    isNew: true,
  },
  {
    id: 5,
    name: "Google Play Gift Card $50",
    price: 185,
    image: "/google-play-gift-card.png",
    category: "Mobile",
    rating: 4.6,
    reviews: 743,
    isNew: true,
    isPopular: true,
  },
  {
    id: 6,
    name: "Steam Wallet Code $100",
    price: 375,
    image: "/steam-wallet-card.png",
    category: "Gaming",
    rating: 4.9,
    reviews: 2134,
    isPopular: true,
    isFeatured: true,
  },
  {
    id: 7,
    name: "Netflix Gift Card $50",
    price: 195,
    image: "/netflix-gift-card.png",
    category: "Entertainment",
    rating: 4.7,
    reviews: 567,
  },
  {
    id: 8,
    name: "Xbox Live Gold 12 Months",
    price: 299,
    image: "/generic-gaming-subscription-card.png",
    category: "Gaming",
    rating: 4.8,
    reviews: 891,
    isNew: true,
  },
  {
    id: 9,
    name: "Spotify Premium Gift Card",
    price: 149,
    image: "/placeholder-aubap.png",
    category: "Entertainment",
    rating: 4.6,
    reviews: 432,
    isNew: true,
  },
  {
    id: 10,
    name: "PUBG Mobile UC 8100",
    price: 299,
    image: "/generic-mobile-game-currency-card.png",
    category: "Mobile",
    rating: 4.5,
    reviews: 678,
    isPopular: true,
  },
  {
    id: 11,
    name: "Fortnite V-Bucks 5000",
    price: 199,
    image: "/generic-game-currency-card.png",
    category: "Gaming",
    rating: 4.7,
    reviews: 1023,
    isPopular: true,
  },
  {
    id: 12,
    name: "Discord Nitro 1 Year",
    price: 399,
    image: "/placeholder-0mqxo.png",
    category: "Services",
    rating: 4.4,
    reviews: 234,
    isFeatured: true,
  },
]

const categories = ["All", "Gaming", "Entertainment", "Shopping", "Mobile", "Services"]
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "discount", label: "Best Discount" },
]

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [minRating, setMinRating] = useState(0)
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false)
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [showOnlyPopular, setShowOnlyPopular] = useState(false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [copied, setCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { addToCart } = useCart()

  // Fix hydration error by only running on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update active filters
  useEffect(() => {
    const filters = []
    if (showOnlyDiscounted) filters.push("On Sale")
    if (showOnlyNew) filters.push("New")
    if (showOnlyPopular) filters.push("Popular")
    if (showOnlyFeatured) filters.push("Featured")
    if (selectedCategory !== "All") filters.push(selectedCategory)
    if (minRating > 0) filters.push(`${minRating}+ Stars`)
    setActiveFilters(filters)
  }, [showOnlyDiscounted, showOnlyNew, showOnlyPopular, showOnlyFeatured, selectedCategory, minRating])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesRating = product.rating >= minRating
      const matchesDiscount = !showOnlyDiscounted || product.discount
      const matchesNew = !showOnlyNew || product.isNew
      const matchesPopular = !showOnlyPopular || product.isPopular
      const matchesFeatured = !showOnlyFeatured || product.isFeatured

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesDiscount &&
        matchesNew &&
        matchesPopular &&
        matchesFeatured
      )
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        case "featured":
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        case "discount":
          return (b.discount || 0) - (a.discount || 0)
        case "popular":
        default:
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.reviews - a.reviews
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy, priceRange, minRating, showOnlyDiscounted, showOnlyNew, showOnlyPopular, showOnlyFeatured])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Simulate 2 second loading time

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500) // Shorter loading for filter changes

    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, sortBy, priceRange, minRating, showOnlyDiscounted, showOnlyNew, showOnlyPopular, showOnlyFeatured])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setPriceRange([0, 500])
    setMinRating(0)
    setShowOnlyDiscounted(false)
    setShowOnlyNew(false)
    setShowOnlyPopular(false)
    setShowOnlyFeatured(false)
  }

  const handleShare = (product: Product) => {
    setCurrentProduct(product)
    setShareDialogOpen(true)
  }

  const copyLink = useCallback(() => {
    if (currentProduct && isClient) {
      const url = `${window.location.origin}/product/${currentProduct.id}`
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [currentProduct, isClient])

  const shareToSocial = (platform: string) => {
    if (!currentProduct || !isClient) return
    
    const url = `${window.location.origin}/product/${currentProduct.id}`
    const text = `Check out this amazing ${currentProduct.name} on OneCard!`
    
    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
        break
    }
    
    window.open(shareUrl, '_blank')
  }

  // Only render share dialog on client to prevent hydration errors
  const renderShareDialog = () => {
    if (!isClient) return null
    
    return (
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Share Product
            </DialogTitle>
          </DialogHeader>
          
          {currentProduct && (
            <div className="space-y-6">
              {/* Product Preview */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <img 
                  src={currentProduct.image || "/placeholder.svg"} 
                  alt={currentProduct.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-foreground font-medium line-clamp-2">{currentProduct.name}</h3>
                  <p className="text-primary font-semibold">{currentProduct.price} ₽</p>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="border border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => shareToSocial('facebook')}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => shareToSocial('twitter')}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="border border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => shareToSocial('linkedin')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => shareToSocial('whatsapp')}
                  >
                    <Whatsapp className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>

                {/* Copy Link */}
                <div className="flex gap-2">
                  <Input
                    value={isClient ? `${window.location.origin}/product/${currentProduct.id}` : ''}
                    readOnly
                    className="bg-muted border-input text-foreground"
                  />
                  <Button 
                    onClick={copyLink}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-500 text-sm flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Link copied to clipboard!
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">All Products</h1>
              <p className="text-muted-foreground">Discover our complete collection of digital gift cards</p>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {filteredAndSortedProducts.length}
              </div>
              <div className="text-muted-foreground text-sm">Products</div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Home</span>
            <span>/</span>
            <span className="text-foreground">Products</span>
          </div>
        </motion.div>

        {/* Active Filters Bar */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <h3 className="text-foreground font-medium flex items-center gap-2">
                    <FilterX className="h-4 w-4" />
                    Active Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge className="bg-primary/20 text-primary border border-primary/30">
                        {filter}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 md:p-6 mb-8 border border-border shadow-lg"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for gift cards, games, entertainment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-muted border-input text-foreground h-12 focus:ring-2 focus:ring-primary/50"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-40 lg:w-48 bg-muted border-input text-foreground h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-foreground">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40 lg:w-48 bg-muted border-input text-foreground h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-foreground">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode and Filters Toggle */}
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-12 w-12"
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-4"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Filters</span>
                <AnimatePresence>
                  {activeFilters.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="ml-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {activeFilters.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Advanced Filters - Responsive */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-border"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Price Range
                    </Label>
                    <Slider 
                      value={priceRange} 
                      onValueChange={setPriceRange} 
                      max={500} 
                      step={10} 
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{priceRange[0]} ₽</span>
                      <span>{priceRange[1]} ₽</span>
                    </div>
                  </div>

                  {/* Minimum Rating */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-medium flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Minimum Rating
                    </Label>
                    <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                      <SelectTrigger className="bg-muted border-input text-foreground">
                        <SelectValue placeholder="Any Rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="0" className="text-foreground">Any Rating</SelectItem>
                        <SelectItem value="4" className="text-foreground">4+ Stars</SelectItem>
                        <SelectItem value="4.5" className="text-foreground">4.5+ Stars</SelectItem>
                        <SelectItem value="4.8" className="text-foreground">4.8+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Filters */}
                  <div className="space-y-3 sm:col-span-2 lg:col-span-2">
                    <Label className="text-foreground font-medium">Quick Filters</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="discounted"
                          checked={showOnlyDiscounted}
                          onCheckedChange={setShowOnlyDiscounted}
                          className="border-border data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground"
                        />
                        <Label htmlFor="discounted" className="text-sm text-foreground flex items-center gap-1">
                          <Tag className="h-3 w-3 text-destructive" />
                          On Sale
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new"
                          checked={showOnlyNew}
                          onCheckedChange={setShowOnlyNew}
                          className="border-border data-[state=checked]:bg-green-500"
                        />
                        <Label htmlFor="new" className="text-sm text-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 text-green-500" />
                          New Arrivals
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="popular"
                          checked={showOnlyPopular}
                          onCheckedChange={setShowOnlyPopular}
                          className="border-border data-[state=checked]:bg-orange-500"
                        />
                        <Label htmlFor="popular" className="text-sm text-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-orange-500" />
                          Popular
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={showOnlyFeatured}
                          onCheckedChange={setShowOnlyFeatured}
                          className="border-border data-[state=checked]:bg-purple-500"
                        />
                        <Label htmlFor="featured" className="text-sm text-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 text-purple-500" />
                          Featured
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-medium">Results</Label>
                    <div className="text-3xl font-bold text-primary">
                      {isLoading ? "..." : filteredAndSortedProducts.length}
                    </div>
                    <p className="text-sm text-muted-foreground">products found</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Grid/List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {viewMode === "grid" ? <ProductCardSkeleton /> : <ProductListSkeleton />}
                </motion.div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {viewMode === "grid" ? (
                    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl">
                      <div className="relative">
                        <motion.img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          whileHover={{ scale: 1.05 }}
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {product.isNew && <Badge className="bg-green-500 text-white shadow-lg">New</Badge>}
                          {product.isPopular && <Badge className="bg-orange-500 text-white shadow-lg">Popular</Badge>}
                          {product.isFeatured && <Badge className="bg-purple-500 text-white shadow-lg">Featured</Badge>}
                          {product.discount && <Badge className="bg-destructive text-destructive-foreground shadow-lg">-{product.discount}%</Badge>}
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border border-border backdrop-blur-sm"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${wishlist.includes(product.id) ? 'text-destructive fill-current' : 'text-foreground'}`} 
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border border-border backdrop-blur-sm"
                            onClick={() => handleShare(product)}
                          >
                            <Share2 className="h-4 w-4 text-foreground" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-foreground">{product.price} ₽</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">{product.originalPrice} ₽</span>
                            )}
                          </div>
                          {product.discount && (
                            <Badge className="bg-green-500/20 text-green-600 border border-green-500/30">
                              Save {product.originalPrice && (product.originalPrice - product.price).toFixed(2)} ₽
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="border-border text-muted-foreground hover:text-foreground hover:border-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 rounded-2xl shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <motion.img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full sm:w-24 h-24 object-cover rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                  {product.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                      />
                                    ))}
                                    <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="outline" className="text-xs border-border text-foreground">
                                    {product.category}
                                  </Badge>
                                  {product.isNew && <Badge className="bg-green-500/20 text-green-600 border border-green-500/30 text-xs">New</Badge>}
                                  {product.isPopular && <Badge className="bg-orange-500/20 text-orange-600 border border-orange-500/30 text-xs">Popular</Badge>}
                                  {product.isFeatured && <Badge className="bg-purple-500/20 text-purple-600 border border-purple-500/30 text-xs">Featured</Badge>}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl font-bold text-foreground">{product.price} ₽</span>
                                  {product.originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {product.originalPrice} ₽
                                    </span>
                                  )}
                                </div>
                                {product.discount && (
                                  <Badge className="bg-green-500/20 text-green-600 border border-green-500/30 mb-2">
                                    Save {product.originalPrice && (product.originalPrice - product.price).toFixed(2)} ₽
                                  </Badge>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="border-border text-muted-foreground hover:text-foreground hover:border-primary"
                                    onClick={() => toggleWishlist(product.id)}
                                  >
                                    <Heart 
                                      className={`h-4 w-4 ${wishlist.includes(product.id) ? 'text-destructive fill-current' : ''}`} 
                                    />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="border-border text-muted-foreground hover:text-foreground hover:border-primary"
                                    onClick={() => handleShare(product)}
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Load More Button */}
        {!isLoading && filteredAndSortedProducts.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              variant="outline" 
              className="border-border text-foreground hover:text-foreground hover:border-primary hover:bg-accent px-8 py-3"
            >
              Load More Products
            </Button>
          </motion.div>
        )}
      </div>

      {/* Share Dialog - Only rendered on client */}
      {renderShareDialog()}
    </div>
  )
}
// ```