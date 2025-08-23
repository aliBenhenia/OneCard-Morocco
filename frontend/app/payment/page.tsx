"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <motion.div 
          className="text-center p-8 rounded-2xl bg-[#1a1a1a] border border-gray-800 max-w-md w-full mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-400 mb-6">Add some digital cards to get started with your purchase</p>
          <Button 
            onClick={() => router.push("/")} 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1a1a1a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()} 
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg"
              >
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
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Secure checkout powered by 256-bit SSL encryption
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {paymentStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-8 text-center relative overflow-hidden"
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
                        delay: 0.2 
                      }}
                      className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h2 
                      className="text-3xl font-bold text-green-400 mb-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Payment Successful!
                    </motion.h2>
                    <motion.p 
                      className="text-gray-300 mb-6 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Your digital cards will be delivered to your email shortly.
                    </motion.p>
                    <motion.div 
                      className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span>Redirecting to homepage in {countdown} seconds...</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button 
                        onClick={() => {
                          clearCart()
                          router.push("/")
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg"
                      >
                        Go to Homepage Now
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[
                      { label: "Cart", completed: true },
                      { label: "Payment", completed: false, active: true },
                      { label: "Confirmation", completed: false }
                    ].map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step.completed 
                            ? "bg-green-500 text-white" 
                            : step.active 
                              ? "bg-blue-500 text-white" 
                              : "bg-gray-700 text-gray-400"
                        }`}>
                          {step.completed ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        <span className={`ml-2 text-sm ${
                          step.completed || step.active ? "text-white" : "text-gray-500"
                        }`}>
                          {step.label}
                        </span>
                        {index < 2 && (
                          <div className={`w-12 h-0.5 mx-2 ${
                            step.completed ? "bg-green-500" : "bg-gray-700"
                          }`}></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-800 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Payment Method</h2>
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                        Secure
                      </Badge>
                    </div>
                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                      {paymentMethods.map((method) => (
                        <motion.div
                          key={method.id}
                          className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer mb-3 ${
                            selectedMethod === method.id
                              ? "border-blue-500 bg-blue-500/5"
                              : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedMethod(method.id)}
                        >
                          <RadioGroupItem 
                            value={method.id} 
                            id={method.id} 
                            className="border-gray-600 text-blue-500"
                          />
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`p-3 rounded-xl ${
                              selectedMethod === method.id 
                                ? "bg-blue-500/20" 
                                : "bg-gray-800"
                            }`}>
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label 
                                  htmlFor={method.id} 
                                  className="font-medium cursor-pointer text-white"
                                >
                                  {method.name}
                                </Label>
                                {method.popular && (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">{method.description}</p>
                            </div>
                            {method.processingFee && (
                              <span className={`text-sm ${
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
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-800 shadow-xl"
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-400" />
                        Card Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                              maxLength={19}
                              className="bg-gray-800 border-gray-700 pl-10 mt-1 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                            maxLength={5}
                            className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                          <div className="relative">
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                              maxLength={4}
                              className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="cardName" className="text-gray-300">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange("cardName", e.target.value)}
                            className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Billing Information */}
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-purple-400" />
                      Billing Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-gray-800 border-gray-700 pl-10 mt-1 focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="billingAddress" className="text-gray-300">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="billingAddress"
                            placeholder="123 Main Street"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                            className="bg-gray-800 border-gray-700 pl-10 mt-1 focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-gray-300">Country</Label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2a2a2a] border-gray-700">
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code} className="text-white">
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-gray-300">City</Label>
                        {formData.country === "MA" ? (
                          <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2a2a] border-gray-700 max-h-60">
                              {moroccanCities.map((city) => (
                                <SelectItem key={city} value={city} className="text-white">
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
                            className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-purple-500"
                          />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-gray-300">
                          {formData.country === "MA" ? "Postal Code" : "ZIP Code"}
                        </Label>
                        <Input
                          id="zipCode"
                          placeholder={formData.country === "MA" ? "20000" : "10001"}
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {paymentStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
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
            <motion.div 
              className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-800 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                  {cartItems.length} items
                </Badge>
              </div>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-white truncate">{item.name}</h3>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      <p className="text-gray-500 text-xs truncate">{item.category}</p>
                    </div>
                    <span className="font-semibold text-white whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                  </motion.div>
                ))}
              </div>

              <Separator className="bg-gray-700 mb-4" />

              <div className="space-y-3 mb-6">
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

              <Separator className="bg-gray-700 mb-4" />

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              {paymentStatus !== "success" && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || paymentStatus === "processing"}
                    className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {paymentStatus === "processing" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <div className="flex flex-col items-start">
                          <span>Processing Payment...</span>
                          <span className="text-xs font-normal opacity-80">Please wait, this may take a moment</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Complete Secure Payment
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Security Features */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Security Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">256-bit SSL Encryption</p>
                      <p className="text-gray-400 text-xs">Bank-level security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">PCI DSS Compliant</p>
                      <p className="text-gray-400 text-xs">Industry standard security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Instant Delivery</p>
                      <p className="text-gray-400 text-xs">Get your cards immediately</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Gift className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">100% Satisfaction</p>
                      <p className="text-gray-400 text-xs">30-day money-back guarantee</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Support */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Need help?</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 text-sm p-0 h-auto">
                    Contact Support
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}