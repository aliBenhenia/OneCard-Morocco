"use client"

import { useState, useEffect, useRef } from "react"
import {
  ShoppingCart,
  Search,
  ChevronDown,
  User,
  Home,
  Package,
  Target,
  CreditCard,
  Gamepad2,
  Smartphone,
  Music,
  ShoppingBag,
  Tv,
  Zap,
  Gift,
  Star,
  X,
  Filter,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { CartSheet } from "@/components/cart-sheet"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
// import logo from public/logo.png
import logo from "@/public/logo.png" // Adjust the path as necessary

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const { state } = useCart()

  // Handle scroll behavior
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY
          setScrollPosition(currentScroll)
          setIsScrolled(currentScroll > 20)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Mock search functionality
  useEffect(() => {
    if (searchQuery.length > 0) {
      const mockResults = [
        { id: 1, name: "Steam Wallet Card $25", category: "Gaming Cards", price: 25.00 },
        { id: 2, name: "Netflix Premium 1 Year", category: "Entertainment", price: 120.00 },
        { id: 3, name: "Amazon Gift Card $50", category: "Shopping", price: 50.00 },
        { id: 4, name: "PlayStation Plus 3 Months", category: "Gaming Cards", price: 29.99 },
        { id: 5, name: "Spotify Premium 6 Months", category: "Entertainment", price: 35.99 },
      ].filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(mockResults)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  const categories = [
    {
      name: "Gaming Cards",
      icon: Gamepad2,
      description: "Steam, PlayStation, Xbox & more",
      color: "from-purple-500 to-pink-500",
      count: 45,
    },
    {
      name: "Mobile Recharge",
      icon: Smartphone,
      description: "Top-up your mobile balance",
      color: "from-green-500 to-emerald-500",
      count: 32,
    },
    {
      name: "Entertainment",
      icon: Music,
      description: "Netflix, Spotify, YouTube Premium",
      color: "from-red-500 to-orange-500",
      count: 28,
    },
    {
      name: "Shopping",
      icon: ShoppingBag,
      description: "Amazon, eBay, retail stores",
      color: "from-blue-500 to-cyan-500",
      count: 38,
    },
    {
      name: "Streaming Services",
      icon: Tv,
      description: "Disney+, Hulu, Prime Video",
      color: "from-indigo-500 to-purple-500",
      count: 22,
    },
    {
      name: "Utilities & Bills",
      icon: Zap,
      description: "Electricity, internet, phone bills",
      color: "from-yellow-500 to-orange-500",
      count: 15,
    },
    {
      name: "Gift Cards",
      icon: Gift,
      description: "Universal gift cards for any occasion",
      color: "from-pink-500 to-rose-500",
      count: 18,
    },
  ]

  const quickLinks = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Bundles", icon: Package, href: "/bundles" },
    { name: "Offers", icon: Target, href: "/offers" },
    { name: "Pay Bills", icon: CreditCard, href: "/pay-bills" },
  ]

  // Calculate navbar transform based on scroll
  const navbarTransform = isScrolled ? Math.max(-100, -scrollPosition / 2) : 0

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-gray-700 transition-all duration-300 ${
          isScrolled ? "shadow-2xl backdrop-blur-md bg-[#1a1a1a]/95" : ""
        }`}
        style={{
          transform: `translateY(${navbarTransform}px)`,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.3 
        }}
      >
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center" 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">OC</span>
                </div>
                <span className="text-white text-xl font-semibold hidden sm:block">OneCard</span>
              </Link>
              {/* <img src="https://www.onecard.com/_next/image/?url=%2Fimages%2FGroup%2016909.png&w=256&q=75" alt="OneCard Logo" className="w-8 h-8" /> */}
            </motion.div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-gray-700/50 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
              <motion.div 
                className="relative" 
                whileFocus={{ scale: 1.02 }} 
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                  type="text"
                  placeholder="Search gift cards, games, entertainment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-full pl-10 pr-10 py-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg shadow-inner"
                />
                {searchQuery && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-600 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium text-sm">Search Results</h3>
                        <span className="text-gray-400 text-xs">{searchResults.length} items</span>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link 
                            href={`/product/${item.id}`}
                            onClick={() => {
                              setShowSearchResults(false)
                              setSearchQuery("")
                            }}
                          >
                            <motion.div
                              whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                              className="p-3 border-b border-gray-700/50 last:border-b-0 cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-white font-medium text-sm">{item.name}</h4>
                                  <p className="text-gray-400 text-xs mt-1">{item.category}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-semibold text-sm">${item.price}</p>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No Results */}
              <AnimatePresence>
                {showSearchResults && searchQuery && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl shadow-2xl z-50 p-6 text-center"
                  >
                    <Filter className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No results found for "{searchQuery}"</p>
                    <p className="text-gray-500 text-xs mt-1">Try different keywords or browse categories</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg px-3 py-2 text-sm">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-white hover:bg-gray-700/50 rounded-lg p-2"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <AnimatePresence>
                    {state.itemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-blue-500 to-purple-500 border-0">
                          {state.itemCount > 99 ? "99+" : state.itemCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Navigation Bar - Desktop */}
          <div className="hidden md:block border-t border-gray-700 py-3">
            <div className="flex items-center space-x-4">
              {/* Categories Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-all duration-200"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="mr-2 text-lg">≡</span>
                    <span className="hidden lg:inline">Shopping Categories</span>
                    <span className="lg:hidden">Categories</span>
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold">Browse Categories</h3>
                          <Link href="/products" onClick={() => setIsDropdownOpen(false)}>
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 text-xs">
                              View All
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {categories.map((category, index) => {
                          const IconComponent = category.icon
                          return (
                            <motion.div
                              key={category.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link href="/products" onClick={() => setIsDropdownOpen(false)}>
                                <motion.button
                                  whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)", x: 4 }}
                                  className="w-full text-left p-4 border-b border-gray-700/50 last:border-b-0 transition-all duration-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}
                                    >
                                      <IconComponent className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-white font-medium text-sm">{category.name}</h4>
                                        <div className="flex items-center space-x-1">
                                          <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                            {category.count}
                                          </Badge>
                                          {category.count > 30 && (
                                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-gray-400 text-xs mt-1">{category.description}</p>
                                    </div>
                                  </div>
                                </motion.button>
                              </Link>
                            </motion.div>
                          )
                        })}
                      </div>

                      <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-600">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Popular this week</span>
                          <div className="flex space-x-2">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Gaming</Badge>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Shopping</Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Links */}
              {quickLinks.map((link) => {
                const IconComponent = link.icon
                return (
                  <motion.div 
                    key={link.name}
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={link.href}>
                      <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-lg flex items-center transition-all duration-200 text-sm"
                      >
                        <IconComponent className="mr-2 h-4 w-4" />
                        <span className="hidden lg:inline">{link.name}</span>
                      </Button>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t border-gray-700 py-3 overflow-hidden"
              >
                <div className="space-y-2">
                  {/* Mobile Search */}
                  <div className="relative mb-3" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchResults(true)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 rounded-lg"
                    />
                  </div>

                  {/* Mobile Quick Links */}
                  <div className="grid grid-cols-2 gap-2">
                    {quickLinks.map((link) => {
                      const IconComponent = link.icon
                      return (
                        <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-lg flex items-center transition-all duration-200 text-sm"
                          >
                            <IconComponent className="mr-2 h-4 w-4" />
                            {link.name}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Mobile Categories Button */}
                  <Button
                    variant="outline"
                    className="w-full text-left justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>Browse Categories</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </Button>

                  {/* Mobile Categories Dropdown */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 mt-2 pl-2">
                          {categories.slice(0, 6).map((category) => {
                            const IconComponent = category.icon
                            return (
                              <Link 
                                key={category.name} 
                                href="/products" 
                                onClick={() => {
                                  setIsDropdownOpen(false)
                                  setIsMobileMenuOpen(false)
                                }}
                              >
                                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700/50">
                                  <div
                                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                                  >
                                    <IconComponent className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="text-white text-sm">{category.name}</span>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}