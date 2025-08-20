"use client"

import { useState } from "react"
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Truck, Shield, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { state, dispatch } = useCart()
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const router = useRouter()

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    setIsRemoving(id)
    setTimeout(() => {
      dispatch({ type: "REMOVE_ITEM", payload: id })
      setIsRemoving(null)
    }, 300)
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const goToPayment = () => {
    onClose()
    router.push("/payment")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-gray-700 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {state.itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-blue-500 to-purple-500 border-0">
                      {state.itemCount}
                    </Badge>
                  )}
                </div>
                Shopping Cart
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose} 
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {state.items.length === 0 ? (
              <motion.div 
                className="flex-1 flex flex-col items-center justify-center space-y-4 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <ShoppingBag className="h-16 w-16 text-gray-600" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-gray-400 text-lg font-medium">Your cart is empty</p>
                  <p className="text-gray-500 text-sm">Add some digital cards to get started</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={onClose} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg"
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <>
                {/* Cart Summary */}
                <motion.div 
                  className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-gray-700 rounded-lg mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">100% Secure</span>
                  </div>
                </motion.div>

                {/* Cart Items Header */}
                <div className="flex items-center justify-between py-2 px-2 border-b border-gray-700">
                  <p className="text-gray-400 text-sm">
                    {state.items.length} item{state.items.length !== 1 ? "s" : ""} in cart
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 text-xs"
                    >
                      Clear All
                    </Button>
                  </motion.div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3 px-2">
                  <AnimatePresence>
                    {state.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center space-x-3 p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl ${
                          isRemoving === item.id ? "opacity-50" : ""
                        }`}
                      >
                        <motion.img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 text-white mb-1">{item.name}</h4>
                          <p className="text-blue-400 font-semibold text-sm">{item.price.toFixed(2)} ₽</p>
                          <p className="text-gray-500 text-xs">{item.category}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-1 bg-[#1a1a1a] rounded-lg p-1">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600 rounded-md"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </motion.div>
                            <span className="w-6 text-center text-sm font-medium text-white">
                              {item.quantity}
                            </span>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600 rounded-md"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-sm font-bold text-white">{(item.price * item.quantity).toFixed(2)} ₽</p>
                          </div>

                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Order Summary */}
                <motion.div 
                  className="border-t border-gray-700 pt-4 space-y-4 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white">{state.total.toFixed(2)} ₽</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Delivery:</span>
                      <span className="text-green-400 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Tax:</span>
                      <span className="text-white">{(state.total * 0.05).toFixed(2)} ₽</span>
                    </div>
                    <div className="border-t border-gray-600 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">Total:</span>
                        <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                          {(state.total * 1.05).toFixed(2)} ₽
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center space-x-4 py-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Shield className="h-3 w-3 text-green-400" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>4.9 Rating</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Truck className="h-3 w-3 text-blue-400" />
                      <span>Instant</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={goToPayment}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Secure Checkout
                    </Button>
                  </motion.div>

                  {/* Continue Shopping */}
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}