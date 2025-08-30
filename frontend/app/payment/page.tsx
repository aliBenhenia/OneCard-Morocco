"use client"

import React, { useState, useEffect } from "react"
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
  Zap,
  Gift,
  Truck,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/api"

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  processingFee?: string
  popular?: boolean
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Visa, Mastercard, American Express",
    processingFee: "Free",
    popular: true
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

const countries = [
  { code: "MA", name: "Morocco" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GB", name: "United Kingdom" },
]

const moroccanCities = [
  "Casablanca", "Rabat", "Fes", "Marrakech", "Tangier", "Agadir", 
  "Meknes", "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia",
  "Khouribga", "El Jadida", "Taza", "Nador", "Settat", "Larache"
]

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state, dispatch } = useCart()
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [countdown, setCountdown] = useState(5)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "MA",
  })

  const cartItems = state.items || []
  const clearCart = () => dispatch({ type: "CLEAR_CART" })
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = total * 0.08
  const finalTotal = total + tax

  // Countdown timer for success redirect
  useEffect(() => {
    if (paymentStatus === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (paymentStatus === "success" && countdown === 0) {
      clearCart()
      router.push("/")
    }
  }, [paymentStatus, countdown])

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
    if (!formData.billingAddress.trim()) {
      setErrorMessage("Please enter your billing address")
      return false
    }
    if (!formData.city.trim()) {
      setErrorMessage("Please enter your city")
      return false
    }
    if (!formData.zipCode.trim()) {
      setErrorMessage("Please enter your ZIP/Postal code")
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

    try {
      // Prepare payment data
      const paymentData = {
        billingInfo: {
          email: formData.email,
          address: formData.billingAddress,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country
        },
        cardInfo: selectedMethod === "card" ? {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardName: formData.cardName
        } : undefined,
        paymentMethod: selectedMethod,
        amount: finalTotal,
        tax: tax,
        cartItems: cartItems,
        // In a real app, you would get the userId from context or authentication
        // userId: "USER_ID_PLACEHOLDER" // Replace with actual user ID
      }

      // Send payment request to server
      const userToken = localStorage.getItem("token");
      if (!userToken) {
        setPaymentStatus("error");
        setErrorMessage("User not authenticated");
        return;
      }
      const response = await api.post("/api/payment/process", paymentData, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      if (response.data.success) {
        setPaymentStatus("success")
      } else {
        throw new Error(response.data.message || "Payment failed. Please try again.")
      }
    } catch (error: any) {
      setPaymentStatus("error")
      setErrorMessage(error.response?.data?.message || "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0 && paymentStatus !== "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center p-4">
        <motion.div 
          className="text-center p-6 rounded-2xl bg-[#1a1a1a] border border-gray-800 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
          <p className="text-gray-400 mb-5 text-sm">Add some digital cards to get started with your purchase</p>
          <Button 
            onClick={() => router.push("/")} 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-3 rounded-lg w-full"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">

      <div className="px-4 py-6">
        <div className="space-y-6">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-1">Complete Your Purchase</h1>
            <p className="text-gray-400 flex items-center gap-1 text-sm">
              <Shield className="w-3 h-3 text-green-400" />
              Secure checkout with 256-bit SSL encryption
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {/* Payment Form */}
            <div className="space-y-5">
              <AnimatePresence mode="wait">
                {paymentStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
                    <div className="relative z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 10,
                          delay: 0.1 
                        }}
                        className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                      >
                        <Check className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h2 
                        className="text-2xl font-bold text-green-400 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Payment Successful!
                      </motion.h2>
                      <motion.p 
                        className="text-gray-300 mb-4 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Your digital cards will be delivered to your email shortly.
                      </motion.p>
                      <motion.div 
                        className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Zap className="w-3 h-3 text-blue-400" />
                        <span>Redirecting in {countdown} seconds...</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button 
                          onClick={() => {
                            clearCart()
                            router.push("/")
                          }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm w-full"
                        >
                          Go to Homepage Now
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-2">
                      {[
                        { label: "Cart", completed: true },
                        { label: "Payment", completed: false, active: true },
                        { label: "Confirmation", completed: false }
                      ].map((step, index) => (
                        <div key={index} className="flex items-center flex-col">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            step.completed 
                              ? "bg-green-500 text-white" 
                              : step.active 
                                ? "bg-blue-500 text-white" 
                                : "bg-gray-700 text-gray-400"
                          }`}>
                            {step.completed ? <Check className="w-3 h-3" /> : index + 1}
                          </div>
                          <span className={`mt-1 text-xs text-center ${
                            step.completed || step.active ? "text-white" : "text-gray-500"
                          }`}>
                            {step.label}
                          </span>
                          {index < 2 && (
                            <div className={`w-8 h-0.5 mx-1 ${
                              step.completed ? "bg-green-500" : "bg-gray-700"
                            }`}></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-5 border border-gray-800 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">Payment Method</h2>
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-0.5">
                          Secure
                        </Badge>
                      </div>
                      <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                        {paymentMethods.map((method) => (
                          <motion.div
                            key={method.id}
                            className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer mb-2 ${
                              selectedMethod === method.id
                                ? "border-blue-500 bg-blue-500/5"
                                : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setSelectedMethod(method.id)}
                          >
                            <RadioGroupItem 
                              value={method.id} 
                              id={method.id} 
                              className="border-gray-600 text-blue-500 w-4 h-4"
                            />
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${
                                selectedMethod === method.id 
                                  ? "bg-blue-500/20" 
                                  : "bg-gray-800"
                              }`}>
                                {method.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <Label 
                                    htmlFor={method.id} 
                                    className="font-medium cursor-pointer text-white text-sm"
                                  >
                                    {method.name}
                                  </Label>
                                  {method.popular && (
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-1.5 py-0">
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400">{method.description}</p>
                              </div>
                              {method.processingFee && (
                                <span className={`text-xs ${
                                  method.processingFee === "Free" 
                                    ? "text-green-400" 
                                    : "text-gray-400"
                                }`}>
                                  {method.processingFee}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Card Details */}
                    {selectedMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-5 border border-gray-800 shadow-lg"
                      >
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-400" />
                          Card Information
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <Label htmlFor="cardNumber" className="text-gray-300 text-sm">Card Number</Label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                                maxLength={19}
                                className="bg-gray-800 border-gray-700 pl-10 mt-1 focus:ring-2 focus:ring-blue-500 h-10 text-sm"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="expiryDate" className="text-gray-300 text-sm">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                                maxLength={5}
                                className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-blue-500 h-10 text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv" className="text-gray-300 text-sm">CVV</Label>
                              <div className="relative">
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  value={formData.cvv}
                                  onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                                  maxLength={4}
                                  className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-blue-500 h-10 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="cardName" className="text-gray-300 text-sm">Cardholder Name</Label>
                            <Input
                              id="cardName"
                              placeholder="John Doe"
                              value={formData.cardName}
                              onChange={(e) => handleInputChange("cardName", e.target.value)}
                              className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-blue-500 h-10 text-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Billing Information */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-5 border border-gray-800 shadow-lg">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-400" />
                        Billing Information
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor="email" className="text-gray-300 text-sm">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className="bg-gray-800 border-gray-700 pl-10 mt-1 focus:ring-2 focus:ring-purple-500 h-10 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="billingAddress" className="text-gray-300 text-sm">Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              id="billingAddress"
                              placeholder="123 Main Street"
                              value={formData.billingAddress}
                              onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                              className="bg-gray-800 border-gray-700 pl-10 mt-1 focus:ring-2 focus:ring-purple-500 h-10 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="country" className="text-gray-300 text-sm">Country</Label>
                            <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                              <SelectTrigger className="bg-gray-800 border-gray-700 mt-1 h-10 text-sm">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#2a2a2a] border-gray-700">
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.code} className="text-white text-sm">
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="city" className="text-gray-300 text-sm">City</Label>
                            {formData.country === "MA" ? (
                              <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 mt-1 h-10 text-sm">
                                  <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2a2a2a] border-gray-700 max-h-40">
                                  {moroccanCities.map((city) => (
                                    <SelectItem key={city} value={city} className="text-white text-sm">
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-purple-500 h-10 text-sm"
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="zipCode" className="text-gray-300 text-sm">
                            {formData.country === "MA" ? "Postal Code" : "ZIP Code"}
                          </Label>
                          <Input
                            id="zipCode"
                            placeholder={formData.country === "MA" ? "20000" : "10001"}
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-purple-500 h-10 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {paymentStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{errorMessage}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-8 h-fit">
              <motion.div 
                className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-5 border border-gray-800 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5">
                    {cartItems.length} items
                  </Badge>
                </div>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/30"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-white truncate">{item.name}</h3>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                        <p className="text-gray-500 text-xs truncate">{item.category}</p>
                      </div>
                      <span className="font-semibold text-white text-sm whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                    </motion.div>
                  ))}
                </div>

                <Separator className="bg-gray-700 mb-3" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (8%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Processing Fee</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery</span>
                    <span className="text-green-400">Instant</span>
                  </div>
                </div>

                <Separator className="bg-gray-700 mb-3" />

                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                {paymentStatus !== "success" && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing || paymentStatus === "processing"}
                      className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                    >
                      {paymentStatus === "processing" ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <div className="flex flex-col items-start">
                            <span>Processing...</span>
                            <span className="text-xs font-normal opacity-80">Please wait</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Payment
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Security Features */}
                <div className="mt-5 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Security Features</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-7 h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-3 h-3 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">256-bit SSL</p>
                        <p className="text-gray-400 text-xs">Bank-level security</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-7 h-7 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-3 h-3 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">PCI DSS</p>
                        <p className="text-gray-400 text-xs">Industry standard</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-7 h-7 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="w-3 h-3 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Instant Delivery</p>
                        <p className="text-gray-400 text-xs">Get cards immediately</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-7 h-7 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Gift className="w-3 h-3 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">100% Satisfaction</p>
                        <p className="text-gray-400 text-xs">30-day guarantee</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Support */}
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Need help?</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 text-xs p-0 h-auto">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}