"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Shield,
  Check,
  AlertCircle,
  Loader2,
  Lock,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  processingFee?: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Visa, Mastercard, American Express",
    processingFee: "Free",
  },
  {
    id: "digital-wallet",
    name: "Digital Wallet",
    icon: <Wallet className="w-5 h-5" />,
    description: "Apple Pay, Google Pay, Samsung Pay",
    processingFee: "Free",
  },
  {
    id: "mobile",
    name: "Mobile Payment",
    icon: <Smartphone className="w-5 h-5" />,
    description: "PayPal, Venmo, Cash App",
    processingFee: "$0.30",
  },
]

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state, dispatch } = useCart()
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "US",
  })

  const cartItems = state.items || []
  const clearCart = () => dispatch({ type: "CLEAR_CART" })
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = total * 0.08
  const finalTotal = total + tax

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (paymentStatus === "error") {
      setPaymentStatus("idle")
      setErrorMessage("")
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const validateForm = () => {
    if (selectedMethod === "card") {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 16) {
        setErrorMessage("Please enter a valid card number")
        return false
      }
      if (!formData.expiryDate || formData.expiryDate.length < 5) {
        setErrorMessage("Please enter a valid expiry date")
        return false
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        setErrorMessage("Please enter a valid CVV")
        return false
      }
      if (!formData.cardName.trim()) {
        setErrorMessage("Please enter the cardholder name")
        return false
      }
    }
    if (!formData.email || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address")
      return false
    }
    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      setPaymentStatus("error")
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate random success/failure for demo
      const success = Math.random() > 0.2 // 80% success rate

      if (success) {
        setPaymentStatus("success")
        setTimeout(() => {
          clearCart()
          router.push("/")
        }, 3000)
      } else {
        throw new Error("Payment declined. Please try a different payment method.")
      }
    } catch (error) {
      setPaymentStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0 && paymentStatus !== "success") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OC</span>
              </div>
              <span className="font-bold text-xl">OneCard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
              <p className="text-gray-400">Secure checkout powered by 256-bit SSL encryption</p>
            </div>

            <AnimatePresence mode="wait">
              {paymentStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-900/20 border border-green-500/30 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h2>
                  <p className="text-gray-300 mb-4">Your digital cards will be delivered to your email shortly.</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting to homepage...
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Payment Methods */}
                  <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center space-x-3 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-gray-800 rounded-lg">{method.icon}</div>
                            <div className="flex-1">
                              <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-gray-400">{method.description}</p>
                            </div>
                            {method.processingFee && (
                              <span className="text-sm text-green-400">{method.processingFee}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Card Details */}
                  {selectedMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800"
                    >
                      <h3 className="text-lg font-semibold mb-4">Card Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="bg-gray-800 border-gray-700 mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                            maxLength={5}
                            className="bg-gray-800 border-gray-700 mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                            maxLength={4}
                            className="bg-gray-800 border-gray-700 mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange("cardName", e.target.value)}
                            className="bg-gray-800 border-gray-700 mt-1"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Billing Information */}
                  <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-gray-800 border-gray-700 mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="billingAddress">Address</Label>
                        <Input
                          id="billingAddress"
                          placeholder="123 Main Street"
                          value={formData.billingAddress}
                          onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                          className="bg-gray-800 border-gray-700 mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="bg-gray-800 border-gray-700 mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          className="bg-gray-800 border-gray-700 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {paymentStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400">{errorMessage}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="bg-gray-700 mb-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing Fee</span>
                  <span className="text-green-400">Free</span>
                </div>
              </div>

              <Separator className="bg-gray-700 mb-4" />

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              {paymentStatus !== "success" && (
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || paymentStatus === "processing"}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                >
                  {paymentStatus === "processing" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Complete Payment
                    </>
                  )}
                </Button>
              )}

              {/* Security Features */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
