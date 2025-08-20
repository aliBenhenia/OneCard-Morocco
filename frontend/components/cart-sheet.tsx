"use client"

import { useState } from "react"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { CheckoutForm } from "@/components/checkout-form"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { state, dispatch } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const router = useRouter()

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const goToPayment = () => {
    onClose()
    router.push("/payment")
  }

  if (showCheckout) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg bg-[#1a1a1a] border-gray-700">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between text-white">
              Checkout
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-white"
              >
                Back to Cart
              </Button>
            </SheetTitle>
          </SheetHeader>
          <CheckoutForm
            total={state.total}
            onSuccess={() => {
              dispatch({ type: "CLEAR_CART" })
              setShowCheckout(false)
              onClose()
            }}
          />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-[#1a1a1a] border-gray-700">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
              {state.itemCount > 0 && <Badge className="bg-blue-600 text-white">{state.itemCount}</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-gray-600" />
              <div className="text-center">
                <p className="text-gray-400 text-lg font-medium">Your cart is empty</p>
                <p className="text-gray-500 text-sm mt-1">Add some digital cards to get started</p>
              </div>
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <p className="text-gray-400 text-sm">
                  {state.items.length} item{state.items.length !== 1 ? "s" : ""} in cart
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  Clear All
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-[#2a2a2a] border border-gray-600 rounded-lg"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 text-white">{item.name}</h4>
                      <p className="text-blue-400 font-semibold">{item.price} ₽</p>
                      <p className="text-gray-500 text-xs">{item.category}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2 bg-[#1a1a1a] rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-white bg-[#2a2a2a] rounded px-2 py-1">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">Subtotal</p>
                        <p className="text-sm font-bold text-white">{(item.price * item.quantity).toFixed(2)} ₽</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-4 bg-[#2a2a2a] p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Items ({state.itemCount}):</span>
                    <span className="text-white">{state.total.toFixed(2)} ₽</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Delivery:</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">Total:</span>
                      <span className="font-bold text-lg text-blue-400">{state.total.toFixed(2)} ₽</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={goToPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
