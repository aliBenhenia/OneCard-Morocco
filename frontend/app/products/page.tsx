"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Grid, List, SlidersHorizontal, Star, ShoppingCart, Eye } from "lucide-react"
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
  },
]

const categories = ["All", "Gaming", "Entertainment", "Shopping", "Mobile", "Services"]
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
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

  const { addToCart } = useCart()

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesRating = product.rating >= minRating
      const matchesDiscount = !showOnlyDiscounted || product.discount
      const matchesNew = !showOnlyNew || product.isNew
      const matchesPopular = !showOnlyPopular || product.isPopular

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesDiscount &&
        matchesNew &&
        matchesPopular
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
        case "popular":
        default:
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.reviews - a.reviews
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy, priceRange, minRating, showOnlyDiscounted, showOnlyNew, showOnlyPopular])

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
  }, [searchQuery, selectedCategory, sortBy, priceRange, minRating, showOnlyDiscounted, showOnlyNew, showOnlyPopular])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">All Products</h1>
          <p className="text-gray-400">Discover our complete collection of digital gift cards</p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#2a2a2a] rounded-xl p-6 mb-8 border border-gray-700"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for gift cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-gray-600 text-white h-12"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 bg-[#1a1a1a] border-gray-600 text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 bg-[#1a1a1a] border-gray-600 text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-600">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode and Filters Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-12 w-12"
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
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Price Range</Label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{priceRange[0]} ₽</span>
                    <span>{priceRange[1]} ₽</span>
                  </div>
                </div>

                {/* Minimum Rating */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Minimum Rating</Label>
                  <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                    <SelectTrigger className="bg-[#1a1a1a] border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2a2a] border-gray-600">
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.8">4.8+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Filters */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Quick Filters</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="discounted"
                        checked={showOnlyDiscounted}
                        onCheckedChange={setShowOnlyDiscounted}
                        className="border-gray-600"
                      />
                      <Label htmlFor="discounted" className="text-sm text-gray-300">
                        On Sale
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new"
                        checked={showOnlyNew}
                        onCheckedChange={setShowOnlyNew}
                        className="border-gray-600"
                      />
                      <Label htmlFor="new" className="text-sm text-gray-300">
                        New Arrivals
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="popular"
                        checked={showOnlyPopular}
                        onCheckedChange={setShowOnlyPopular}
                        className="border-gray-600"
                      />
                      <Label htmlFor="popular" className="text-sm text-gray-300">
                        Popular
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Results</Label>
                  <div className="text-2xl font-bold text-blue-400">
                    {isLoading ? "..." : filteredAndSortedProducts.length}
                  </div>
                  <p className="text-sm text-gray-400">products found</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid/List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {isLoading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                    <Card className="bg-[#2a2a2a] border-gray-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                          {product.isPopular && <Badge className="bg-orange-500 text-white">Popular</Badge>}
                          {product.discount && <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>}
                        </div>
                        <div className="absolute top-3 right-3">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-300 ml-1">{product.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">{product.price} ₽</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">{product.originalPrice} ₽</span>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-[#2a2a2a] border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm text-gray-300 ml-1">{product.rating}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                                  <Badge variant="outline" className="text-xs">
                                    {product.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg font-bold text-white">{product.price} ₽</span>
                                  {product.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {product.originalPrice} ₽
                                    </span>
                                  )}
                                </div>
                                <Button
                                  onClick={() => handleAddToCart(product)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Add to Cart
                                </Button>
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
      </div>
    </div>
  )
}
