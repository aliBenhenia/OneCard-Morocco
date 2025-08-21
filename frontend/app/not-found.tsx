"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Search, ArrowRight, RotateCcw } from "lucide-react"

export default function NotFoundPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render on client to prevent hydration errors
  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center">
        {/* Animated 404 Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-primary/10 blur-xl"></div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-accent/10 blur-xl"></div>
          
          {/* Main 404 Display */}
          <div className="relative z-10">
            <div className="flex justify-center items-end mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                4
              </motion.div>
              
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: 0.5
                }}
                className="text-9xl md:text-[12rem] font-bold text-primary"
              >
                0
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
              >
                4
              </motion.div>
            </div>
            
            {/* Glowing Line */}
            <motion.div 
              className="h-1 w-32 mx-auto bg-gradient-to-r from-primary/50 to-accent/50 rounded-full mb-8"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            Page Not Found
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/products">
                <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-full text-lg font-medium">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Need Help?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors flex items-center">
              Contact Support
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link href="/faq" className="text-primary hover:text-primary/80 transition-colors flex items-center">
              FAQ
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link href="/about" className="text-primary hover:text-primary/80 transition-colors flex items-center">
              About Us
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>

        {/* Fun Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12"
        >
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try refreshing the page
          </Button>
        </motion.div>
      </div>
    </div>
  )
}