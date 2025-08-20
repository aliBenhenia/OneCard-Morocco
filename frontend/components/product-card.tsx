"use client"

import { ShoppingCart, Plus, Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import type { CartItem } from "@/contexts/cart-context"
import { useState } from "react"
import { motion } from "framer-motion"

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
}: ProductCardProps) {
  const { dispatch, state } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const isInCart = state.items.some((item) => item.id === id)

  const handleAddToCart = () => {
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
    }, 1000)
  }

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3 }}>
      <Card className="group hover:shadow-2xl transition-all duration-300 bg-[#2a2a2a] border-gray-600 rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <motion.img
              src={image || "/placeholder.svg"}
              alt={name}
              className="w-full h-40 object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            {discount && (
              <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Secured 99.9%
              </Badge>
            )}

            <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
              <span className="text-white text-xs">{rating}</span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
              {name}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-lg">{price} ₽</span>
                {originalPrice && <span className="text-sm text-gray-400 line-through">{originalPrice} ₽</span>}
              </div>
              {discount && <Badge className="bg-red-500 text-white text-xs">-{discount}%</Badge>}
            </div>

            <div className="flex items-center space-x-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded disabled:opacity-50 transition-all duration-200"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAdding ? "Adding..." : isInCart ? "Add More" : "Buy Now"}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="sm"
                  className="p-2 border-gray-600 text-gray-400 hover:text-white hover:border-blue-500 bg-transparent hover:bg-blue-600/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
