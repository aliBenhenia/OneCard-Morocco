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
  Phone,
  Mail,
  MapPin,
  Heart,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Wallet,
  Truck,
  Shield,
  Award,
  Headphones,
  Grid3X3,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { CartSheet } from "@/components/cart-sheet"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import api from "@/api"
import axios from "axios"
import { useAuth } from "@/contexts/AuthContext"

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [userProfile, setUserProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const userMenuRef = useRef(null)
  const megaMenuRef = useRef(null)
  const { state } = useCart();
  const { state: authState } = useAuth();

  // Check for token and fetch profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if token exists (you might need to adjust this based on your auth setup)
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        
        if (token) {
          const response = await api.get("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })  
          if (response.data.success) {
            setUserProfile(response.data.user)
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        // Clear token if invalid
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [authState])

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
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false)
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
        { id: 6, name: "Google Play $25", category: "Mobile", price: 24.99 },
        { id: 7, name: "Xbox Live Gold 1 Month", category: "Gaming", price: 9.99 },
        { id: 8, name: "Disney+ Annual", category: "Entertainment", price: 79.99 },
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
      popular: true,
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
      popular: true,
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

  const userMenuItems = [
    { name: "My Account", icon: User, href: "/profile" },
    { name: "My Orders", icon: Package, href: "/" },
    { name: "Wishlist", icon: Heart, href: "/" },
    { name: "Notifications", icon: Bell, href: "/" },
    { name: "Settings", icon: Settings, href: "/" },
    { name: "Logout", icon: LogOut, href: "/" },
  ]

  const megaMenuCategories = [
    {
      title: "Gaming",
      items: [
        { name: "Steam Wallet", href: "/gaming/steam" },
        { name: "PlayStation Network", href: "/gaming/psn" },
        { name: "Xbox Live", href: "/gaming/xbox" },
        { name: "Nintendo eShop", href: "/gaming/nintendo" },
        { name: "Game Currency", href: "/gaming/currency" },
      ],
      icon: Gamepad2,
      color: "text-purple-400",
    },
    {
      title: "Entertainment",
      items: [
        { name: "Netflix", href: "/entertainment/netflix" },
        { name: "Disney+", href: "/entertainment/disney" },
        { name: "Spotify", href: "/entertainment/spotify" },
        { name: "Apple TV+", href: "/entertainment/apple-tv" },
        { name: "HBO Max", href: "/entertainment/hbo" },
      ],
      icon: Music,
      color: "text-red-400",
    },
    {
      title: "Shopping",
      items: [
        { name: "Amazon", href: "/shopping/amazon" },
        { name: "eBay", href: "/shopping/ebay" },
        { name: "Walmart", href: "/shopping/walmart" },
        { name: "Target", href: "/shopping/target" },
        { name: "Best Buy", href: "/shopping/best-buy" },
      ],
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      title: "Mobile",
      items: [
        { name: "Google Play", href: "/mobile/google-play" },
        { name: "App Store", href: "/mobile/app-store" },
        { name: "Mobile Recharge", href: "/mobile/recharge" },
        { name: "Data Plans", href: "/mobile/data" },
        { name: "Prepaid Cards", href: "/mobile/prepaid" },
      ],
      icon: Smartphone,
      color: "text-green-400",
    },
  ]

  const supportItems = [
    { name: "24/7 Support", icon: Headphones, description: "Always here to help" },
    { name: "Secure Payments", icon: Shield, description: "Bank-level encryption" },
    { name: "Fast Delivery", icon: Truck, description: "Instant digital delivery" },
    { name: "Money Back", icon: Award, description: "30-day guarantee" },
  ]

  const bottomNavItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Categories", icon: Grid3X3, href: "/products" },
    { name: "Search", icon: Search, href: "/" },
    { name: "Cart", icon: ShoppingCart, href: "/" },
    { name: "Profile", icon: User, href: "/profile" },
  ]

  // Calculate navbar transform based on scroll
  const navbarTransform = isScrolled ? Math.max(-100, -scrollPosition / 2) : 0

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setUserProfile(null)
    setIsUserMenuOpen(false)
  }

  return (
    <>
      {/* Top Bar - Contact Info (Hidden on mobile) */}
      <div className="hidden md:block bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-gray-300 hover:text-white transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center text-gray-300 hover:text-white transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              <span>support@onecard.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src="/visa.png" alt="Visa" className="h-4 opacity-70" />
              <img src="/mastercard.png" alt="Mastercard" className="h-4 opacity-70" />
              <img src="/paypal.png" alt="PayPal" className="h-4 opacity-70" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center" 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">OC</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-white text-xl font-bold">OneCard</span>
                  <div className="text-xs text-gray-400 -mt-1">Digital Marketplace</div>
                </div>
              </Link>
            </motion.div>

            {/* Search Bar - Responsive */}
            <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-2 md:mx-4 relative" ref={searchRef}>
              <motion.div 
                className="relative" 
                whileFocus={{ scale: 1.02 }} 
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                  type="text"
                  placeholder="Search gift cards, games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-full pl-10 pr-10 py-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg shadow-inner text-sm"
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
                    className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2 border-b border-gray-600 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium text-sm">Search Results</h3>
                        <span className="text-gray-400 text-xs">{searchResults.length} items</span>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
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
                              className="p-2 border-b border-gray-700/50 last:border-b-0 cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-white font-medium text-sm">{item.name}</h4>
                                  <p className="text-gray-400 text-xs mt-1">{item.category}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-semibold text-sm">${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="p-2 border-t border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900">
                      <Link 
                        href={`/search?q=${searchQuery}`}
                        onClick={() => {
                          setShowSearchResults(false)
                          setSearchQuery("")
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center"
                      >
                        View all results
                      </Link>
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
                    className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl shadow-2xl z-50 p-4 text-center"
                  >
                    <Filter className="h-6 w-6 text-gray-500 mx-auto mb-1" />
                    <p className="text-gray-400 text-sm">No results found</p>
                    <p className="text-gray-500 text-xs mt-1">Try different keywords</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Categories Mega Menu */}
              <div className="relative" ref={megaMenuRef}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg flex items-center shadow-lg transition-all duration-200 text-sm"
                    onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  >
                    <span className="mr-1 text-lg">≡</span>
                    <span>Categories</span>
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`}
                    />
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {isMegaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-[800px] bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="grid grid-cols-4 gap-4 p-4">
                        {megaMenuCategories.map((category, index) => {
                          const IconComponent = category.icon
                          return (
                            <div key={category.title} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <IconComponent className={`h-4 w-4 ${category.color}`} />
                                <h3 className="text-white font-semibold text-sm">{category.title}</h3>
                              </div>
                              <ul className="space-y-1">
                                {category.items.map((item) => (
                                  <li key={item.name}>
                                    <Link 
                                      href={item.href} 
                                      onClick={() => setIsMegaMenuOpen(false)}
                                      className="text-gray-400 hover:text-white text-xs flex items-center justify-between group"
                                    >
                                      <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                      
                      <div className="border-t border-gray-700 p-3 bg-gradient-to-r from-gray-800 to-gray-900">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {supportItems.map((item, index) => {
                            const IconComponent = item.icon
                            return (
                              <div key={index} className="flex items-center space-x-1">
                                <div className="p-1 bg-gray-700 rounded">
                                  <IconComponent className="h-3 w-3 text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-white text-xs font-medium">{item.name}</div>
                                  <div className="text-gray-400 text-[10px]">{item.description}</div>
                                </div>
                              </div>
                            )
                          })}
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
                        className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-2 py-2 rounded-lg flex items-center transition-all duration-200 text-sm"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="ml-2 hidden xl:inline">{link.name}</span>
                      </Button>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-1">
              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {loadingProfile ? (
                  <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
                ) : userProfile ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg p-2"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {userProfile.firstName?.charAt(0)}{userProfile.lastName?.charAt(0)}
                      </div>
                    </Button>
                  </motion.div>
                ) : (
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-sm">
                      Login
                    </Button>
                  </Link>
                )}

                <AnimatePresence>
                  {isUserMenuOpen && userProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-1 w-56 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-600 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">
                              {userProfile.firstName} {userProfile.lastName}
                            </div>
                            <div className="text-gray-400 text-xs">{userProfile.email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        {userMenuItems.map((item) => {
                          const IconComponent = item.icon
                          return (
                            <Link 
                              key={item.name} 
                              href={item.href}
                              onClick={() => {
                                if (item.name === "Logout") {
                                  handleLogout()
                                } else {
                                  setIsUserMenuOpen(false)
                                }
                              }}
                            >
                              <div className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 cursor-pointer">
                                <IconComponent className="h-4 w-4" />
                                <span className="text-sm">{item.name}</span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
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

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-gray-700/50 p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
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
                className="lg:hidden border-t border-gray-700 py-3 overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Mobile Categories */}
                  <div className="space-y-2">
                    <div className="px-2 py-1 text-gray-400 text-sm font-medium">Categories</div>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.slice(0, 6).map((category) => {
                        const IconComponent = category.icon
                        return (
                          <Link 
                            key={category.name} 
                            href="/products" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-700/50"
                          >
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                            >
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-white text-xs text-center">{category.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Mobile Quick Links */}
                  <div className="space-y-2">
                    <div className="px-2 py-1 text-gray-400 text-sm font-medium">Quick Links</div>
                    <div className="grid grid-cols-2 gap-2">
                      {quickLinks.map((link) => {
                        const IconComponent = link.icon
                        return (
                          <Link 
                            key={link.name} 
                            href={link.href} 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg"
                          >
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm">{link.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-700 z-50">
        <div className="grid grid-cols-5">
          {bottomNavItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex flex-col items-center justify-center py-2 text-gray-400 hover:text-white transition-colors">
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-16" />
      <div className="lg:hidden h-16" />

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}