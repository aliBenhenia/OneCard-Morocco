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
  Sparkles,
  Crown,
  Gem,
  TrendingUp,
  Clock,
  Tag,
  Users,
  Globe,
  Lock,
  ThumbsUp,
  Rocket,
  Wifi,
  Battery,
  Zap as Lightning,
  Camera,
  Palette,
  Code,
  Book,
  Dumbbell,
  Plane,
  Car,
  Building,
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

// Enhanced Logo Component
const EnhancedLogo = () => {
  return (
    <div className="flex items-center space-x-3 group">
      <div className="relative">
        {/* Main logo container with gradient background */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
          {/* Inner card effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl sm:rounded-2xl"></div>
          
          {/* Card icon */}
          <div className="relative z-10">
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-md flex items-center justify-center">
                <div className="w-3 h-2 sm:w-4 sm:h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-sm"></div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-0.5 -left-0.5 sm:-bottom-1 sm:-left-1 w-1 h-1 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-ping"></div>
      </div>
      
      {/* Brand name with gradient text */}
      <div className="flex flex-col">
        <span className="text-white text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          OneCard
        </span>
        <div className="flex items-center space-x-1">
          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
          <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Premium Digital</span>
        </div>
      </div>
    </div>
  )
}

// Premium Search Component
const PremiumSearch = ({ searchQuery, setSearchQuery, setShowSearchResults, searchResults, showSearchResults, searchRef }) => {
  return (
    <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-1 md:mx-2 relative" ref={searchRef}>
      <motion.div 
        className="relative group" 
        whileFocus={{ scale: 1.02 }} 
        transition={{ duration: 0.2 }}
      >
        {/* Search container with glow effect */}
        <div className="relative rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 p-0.5 shadow-lg group-focus-within:ring-2 group-focus-within:ring-blue-500/50">
          <div className="flex items-center bg-gray-900 rounded-lg sm:rounded-xl">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5 sm:h-4 sm:w-4 z-10" />
            <Input
              type="text"
              placeholder="Search gift cards, games, entertainment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0 focus:outline-none rounded-lg sm:rounded-xl text-xs sm:text-sm"
            />
            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 sm:right-2.5 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Search suggestions */}
        {searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">Quick Search</h3>
                <span className="text-gray-400 text-xs">Press Enter to search</span>
              </div>
            </div>
            
            <div className="p-2">
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer">
                <Search className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Search for "{searchQuery}"</span>
              </div>
              
              <div className="mt-1 space-y-1">
                {['Steam Wallet', 'Netflix', 'Amazon', 'PlayStation', 'Xbox', 'Google Play'].map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => setSearchQuery(suggestion)}
                  >
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-400 text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
            className="absolute top-full left-0 right-0 mt-1 sm:mt-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2 sm:p-3 border-b border-gray-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">Search Results</h3>
                <span className="text-gray-400 text-xs">{searchResults.length} items</span>
              </div>
            </div>

            <div className="max-h-60 sm:max-h-80 overflow-y-auto">
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
                      className="p-2 sm:p-3 border-b border-gray-700/50 last:border-b-0 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium text-xs sm:text-sm">{item.name}</h4>
                            <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">{item.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold text-xs sm:text-sm">${item.price.toFixed(2)}</p>
                          <Badge className="mt-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[8px] sm:text-xs px-1 py-0">
                            Popular
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="p-2 sm:p-3 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <Link 
                href={`/search?q=${searchQuery}`}
                onClick={() => {
                  setShowSearchResults(false)
                  setSearchQuery("")
                }}
                className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm flex items-center justify-center"
              >
                View all {searchResults.length} results
                <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
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
            className="absolute top-full left-0 right-0 mt-1 sm:mt-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 p-4 sm:p-6 text-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
            </div>
            <h3 className="text-white font-semibold text-sm sm:text-lg mb-1">No results found</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">We couldn't find anything matching "{searchQuery}"</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm">
              Browse Categories
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Premium Category Card Component
const PremiumCategoryCard = ({ category, onClick }) => {
  const IconComponent = category.icon
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-md`}>
            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          {category.popular && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[8px] sm:text-xs px-1.5 py-0.5">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />
              Popular
            </Badge>
          )}
        </div>
        
        <h3 className="text-white font-semibold text-xs sm:text-sm mb-1">{category.name}</h3>
        <p className="text-gray-400 text-[10px] sm:text-xs mb-2">{category.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-[10px] sm:text-xs">{category.count} items</span>
          <div className="flex items-center text-blue-400 text-[10px] sm:text-xs">
            <span>Explore</span>
            <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Premium Mega Menu Component
const PremiumMegaMenu = ({ isOpen, onClose, categories, supportItems }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 sm:mt-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden w-[95vw] max-w-6xl"
        >
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* Categories Section */}
              <div className="lg:col-span-9">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-white font-bold text-sm sm:text-lg">All Categories</h3>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] sm:text-xs px-2 py-0.5">
                    {categories.length} Categories
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                  {categories.map((category, index) => (
                    <PremiumCategoryCard 
                      key={category.name} 
                      category={category} 
                      onClick={onClose}
                    />
                  ))}
                </div>
              </div>
              
              {/* Featured Section */}
              <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-gray-700 pt-3 lg:pt-0 lg:pl-6">
                <h3 className="text-white font-bold text-sm sm:text-lg mb-3 sm:mb-4">Featured</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2" />
                      <span className="text-white font-semibold text-xs sm:text-sm">Premium Offers</span>
                    </div>
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-2 sm:mb-3">Exclusive deals for premium members</p>
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-[10px] sm:text-xs py-1.5 sm:py-2 rounded-lg">
                      View Offers
                    </Button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2" />
                      <span className="text-white font-semibold text-xs sm:text-sm">Popular Categories</span>
                    </div>
                    <div className="space-y-2">
                      {categories.filter(cat => cat.popular).slice(0, 3).map((category, index) => (
                        <Link 
                          key={index} 
                          href="/products" 
                          onClick={onClose}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                        >
                          <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                            <category.icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-white text-xs">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Support Section */}
            <div className="border-t border-gray-700 mt-4 sm:mt-6 pt-3 sm:pt-4 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {supportItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="p-1.5 sm:p-2 bg-gray-700 rounded-lg">
                        <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white text-[10px] sm:text-xs font-medium">{item.name}</div>
                        <div className="text-gray-400 text-[9px] sm:text-[10px]">{item.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Premium User Menu Component
const PremiumUserMenu = ({ isOpen, onClose, userProfile, onLogout }) => {
  const userMenuItems = [
    { name: "My Account", icon: User, href: "/profile" },
    { name: "My Orders", icon: Package, href: "/orders" },
    { name: "Wishlist", icon: Heart, href: "/wishlist" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "Logout", icon: LogOut, href: "/", action: "logout" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-1 sm:mt-2 w-64 sm:w-72 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
        >
          {/* User Profile Header */}
          <div className="p-3 sm:p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  {userProfile?.firstName} {userProfile?.lastName}
                </div>
                <div className="text-gray-400 text-[10px] sm:text-xs flex items-center">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[8px] sm:text-xs mr-1 px-1 py-0">
                    Premium
                  </Badge>
                  Member
                </div>
                <div className="text-gray-500 text-[10px] sm:text-xs mt-1">{userProfile?.email}</div>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-white font-bold text-xs">24</div>
                <div className="text-gray-400 text-[9px]">Orders</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-white font-bold text-xs">$1,240</div>
                <div className="text-gray-400 text-[9px]">Spent</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-white font-bold text-xs">18</div>
                <div className="text-gray-400 text-[9px]">Wishlist</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1.5 sm:py-2">
            {userMenuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => {
                    if (item.action === "logout") {
                      onLogout()
                    } else {
                      onClose()
                    }
                  }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer transition-colors">
                    <div className="p-1.5 sm:p-2 bg-gray-800 rounded-lg">
                      <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                    {item.name === "Notifications" && (
                      <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[8px] sm:text-xs px-1.5 py-0">
                        3
                      </Badge>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* Upgrade Section */}
          <div className="p-3 sm:p-4 border-t border-gray-700 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-xs sm:text-sm">Upgrade to Pro</div>
                <div className="text-gray-400 text-[10px] sm:text-xs">Get exclusive benefits</div>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                Upgrade
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Premium Mobile Menu Component
const PremiumMobileMenu = ({ isOpen, onClose, categories, quickLinks }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden border-t border-gray-700 py-3 sm:py-4 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-900/90"
        >
          <div className="px-3 sm:px-4 space-y-5 sm:space-y-6">
            {/* Categories Section */}
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-white font-bold text-base sm:text-lg">Categories</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white p-1.5"
                  onClick={onClose}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {categories.slice(0, 9).map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Link 
                      key={category.name} 
                      href="/products" 
                      onClick={onClose}
                      className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-md`}
                      >
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <span className="text-white text-[10px] sm:text-xs text-center font-medium">{category.name}</span>
                      <Badge className="bg-gray-700 text-gray-400 text-[8px] sm:text-[10px] px-1 py-0">
                        {category.count}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2 sm:mb-3">Quick Links</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {quickLinks.map((link) => {
                  const IconComponent = link.icon
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={onClose}
                      className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="p-1.5 sm:p-2 bg-gray-700 rounded-lg">
                        <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
                      </div>
                      <span className="text-white text-xs sm:text-sm">{link.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2 sm:mb-3">Support</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {[
                  { name: "24/7 Support", icon: Headphones, color: "from-blue-500 to-cyan-500" },
                  { name: "Secure Payments", icon: Lock, color: "from-green-500 to-emerald-500" },
                  { name: "Fast Delivery", icon: Truck, color: "from-purple-500 to-pink-500" },
                  { name: "Money Back", icon: Award, color: "from-yellow-500 to-orange-500" },
                ].map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div 
                      key={index} 
                      className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-xl bg-gray-800/50"
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xs sm:text-sm font-medium">{item.name}</div>
                        <div className="text-gray-400 text-[10px] sm:text-xs">Guaranteed</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

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
        { id: 9, name: "Apple Gift Card $100", category: "Shopping", price: 99.99 },
        { id: 10, name: "iTunes Gift Card $50", category: "Entertainment", price: 49.99 },
        { id: 11, name: "Google Play $100", category: "Mobile", price: 99.99 },
        { id: 12, name: "Hulu Premium 1 Year", category: "Entertainment", price: 71.99 },
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
    {
      name: "Travel",
      icon: Plane,
      description: "Flight, hotel, car rentals",
      color: "from-cyan-500 to-blue-500",
      count: 12,
    },
    {
      name: "Fitness",
      icon: Dumbbell,
      description: "Gym memberships, fitness apps",
      color: "from-green-500 to-emerald-500",
      count: 9,
    },
    {
      name: "Education",
      icon: Book,
      description: "Online courses, learning platforms",
      color: "from-indigo-500 to-purple-500",
      count: 14,
    },
    {
      name: "Business",
      icon: Building,
      description: "Software, tools, services",
      color: "from-gray-500 to-blue-500",
      count: 11,
    },
    {
      name: "Photography",
      icon: Camera,
      description: "Photo editing, stock images",
      color: "from-pink-500 to-red-500",
      count: 7,
    },
  ]

  const quickLinks = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Bundles", icon: Package, href: "/bundles" },
    { name: "Offers", icon: Target, href: "/offers" },
    { name: "Pay Bills", icon: CreditCard, href: "/pay-bills" },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between text-[10px] sm:text-sm">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="flex items-center text-gray-300 hover:text-white transition-colors group">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:text-blue-400 transition-colors" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center text-gray-300 hover:text-white transition-colors group">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:text-blue-400 transition-colors" />
              <span>support@onecard.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center text-gray-300 group">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:text-blue-400 transition-colors" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="flex items-center justify-center w-6 h-4 sm:w-8 sm:h-5 bg-gray-800 rounded border border-gray-600">
                <img src="/visa.png" alt="Visa" className="h-2 sm:h-3 opacity-70" />
              </div>
              <div className="flex items-center justify-center w-6 h-4 sm:w-8 sm:h-5 bg-gray-800 rounded border border-gray-600">
                <img src="/mastercard.png" alt="Mastercard" className="h-2 sm:h-3 opacity-70" />
              </div>
              <div className="flex items-center justify-center w-6 h-4 sm:w-8 sm:h-5 bg-gray-800 rounded border border-gray-600">
                <img src="/paypal.png" alt="PayPal" className="h-2 sm:h-3 opacity-70" />
              </div>
              <div className="flex items-center justify-center w-6 h-4 sm:w-8 sm:h-5 bg-gray-800 rounded border border-gray-600">
                <img src="/apple-pay.png" alt="Apple Pay" className="h-2 sm:h-3 opacity-70" />
              </div>
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
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center" 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <EnhancedLogo />
              </Link>
            </motion.div>

            {/* Search Bar - Responsive */}
            <PremiumSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowSearchResults={setShowSearchResults}
              searchResults={searchResults}
              showSearchResults={showSearchResults}
              searchRef={searchRef}
            />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-0.5 sm:space-x-1">
              {/* Categories Mega Menu */}
              <div 
                className="relative" 
                ref={megaMenuRef}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl flex items-center shadow-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Grid3X3 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>All Categories</span>
                    <ChevronDown
                      className={`ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`}
                    />
                  </Button>
                </motion.div>

                <PremiumMegaMenu 
                  isOpen={isMegaMenuOpen}
                  onClose={() => setIsMegaMenuOpen(false)}
                  categories={categories}
                  supportItems={supportItems}
                />
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
                        className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl flex items-center transition-all duration-200 text-xs sm:text-sm font-medium"
                      >
                        <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="ml-1.5 sm:ml-2 hidden xl:inline">{link.name}</span>
                      </Button>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {/* User Menu */}
              <div 
                className="relative" 
                ref={userMenuRef}
                onMouseEnter={() => userProfile && setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                {loadingProfile ? (
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gray-700 animate-pulse"></div>
                ) : userProfile ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 relative"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                        {userProfile.firstName?.charAt(0)}{userProfile.lastName?.charAt(0)}
                      </div>
                      <Badge className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center p-0 text-[8px] sm:text-[10px] bg-gradient-to-r from-green-500 to-emerald-500 border-0">
                        3
                      </Badge>
                    </Button>
                  </motion.div>
                ) : (
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium">
                      Sign In
                    </Button>
                  </Link>
                )}

                <PremiumUserMenu 
                  isOpen={isUserMenuOpen}
                  onClose={() => setIsUserMenuOpen(false)}
                  userProfile={userProfile}
                  onLogout={handleLogout}
                />
              </div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-white hover:bg-gray-700/50 rounded-lg sm:rounded-xl p-1.5 sm:p-2"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <AnimatePresence>
                    {state.itemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs bg-gradient-to-r from-blue-500 to-purple-500 border-0">
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
                className="lg:hidden text-white hover:bg-gray-700/50 p-1.5 sm:p-2 rounded-lg sm:rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <PremiumMobileMenu 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            categories={categories}
            quickLinks={quickLinks}
          />
        </div>
      </motion.nav>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-700 z-50 pb-safe">
        <div className="grid grid-cols-5 bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-xl sm:rounded-t-2xl shadow-2xl">
          {bottomNavItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex flex-col items-center justify-center py-2.5 sm:py-3 text-gray-400 hover:text-white transition-colors relative">
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-[10px] sm:text-xs mt-1">{item.name}</span>
                  {item.name === "Cart" && state.itemCount > 0 && (
                    <Badge className="absolute top-1 right-2.5 sm:right-3 h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center p-0 text-[8px] sm:text-[10px] bg-gradient-to-r from-blue-500 to-purple-500 border-0">
                      {state.itemCount}
                    </Badge>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-14 sm:h-16" />
      <div className="lg:hidden h-16" />

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}