"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Loader2, CreditCard, Shield, Lock, Wallet, Smartphone, Globe } from "lucide-react"

interface CheckoutFormProps {
  total: number
  onSuccess: () => void
}

interface FormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  zipCode: string
  country: string
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
  saveCard: boolean
  agreeToTerms: boolean
}

export function CheckoutForm({ total, onSuccess }: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>()

  const watchSaveCard = watch("saveCard")
  const watchAgreeToTerms = watch("agreeToTerms")

  const onSubmit = async (data: FormData) => {
    if (!data.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setIsSuccess(true)

    // Auto-close after success
    setTimeout(() => {
      onSuccess()
    }, 3000)
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 py-12">
        <div className="relative">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>
        <div className="text-center space-y-3 max-w-md">
          <h3 className="text-3xl font-bold text-white">Payment Successful!</h3>
          <p className="text-gray-400 text-lg">Your order has been confirmed</p>
          <p className="text-sm text-gray-500">Digital cards will be delivered to your email within 5 minutes</p>
        </div>
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 rounded-xl border border-green-500/20 w-full max-w-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-lg">Order Total:</span>
            <span className="text-white font-bold text-2xl">{total.toFixed(2)} ₽</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div className="flex items-center justify-center space-x-3 text-green-400 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20">
        <Shield className="h-5 w-5" />
        <span className="text-sm font-medium">Secure 256-bit SSL Encryption</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="checkout-form">
            <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-gray-600 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 bg-[#1a1a1a] hover:border-gray-500"
                    }`}
                  >
                    <CreditCard className="h-6 w-6 text-blue-400" />
                    <span className="text-sm font-medium text-white">Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                      paymentMethod === "wallet"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 bg-[#1a1a1a] hover:border-gray-500"
                    }`}
                  >
                    <Wallet className="h-6 w-6 text-green-400" />
                    <span className="text-sm font-medium text-white">Digital Wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mobile")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                      paymentMethod === "mobile"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 bg-[#1a1a1a] hover:border-gray-500"
                    }`}
                  >
                    <Smartphone className="h-6 w-6 text-purple-400" />
                    <span className="text-sm font-medium text-white">Mobile Pay</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-gray-600 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                      errors.email ? "border-red-500" : "focus:border-blue-500"
                    }`}
                  />
                  {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName", { required: "First name is required" })}
                      className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                        errors.firstName ? "border-red-500" : "focus:border-blue-500"
                      }`}
                    />
                    {errors.firstName && <p className="text-sm text-red-400 mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName", { required: "Last name is required" })}
                      className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                        errors.lastName ? "border-red-500" : "focus:border-blue-500"
                      }`}
                    />
                    {errors.lastName && <p className="text-sm text-red-400 mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-gray-600 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  Billing Address
                  <Globe className="h-5 w-5 text-blue-400 ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white font-medium">
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    {...register("address", { required: "Address is required" })}
                    className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                      errors.address ? "border-red-500" : "focus:border-blue-500"
                    }`}
                  />
                  {errors.address && <p className="text-sm text-red-400 mt-1">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      {...register("city", { required: "City is required" })}
                      className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                        errors.city ? "border-red-500" : "focus:border-blue-500"
                      }`}
                    />
                    {errors.city && <p className="text-sm text-red-400 mt-1">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-white font-medium">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      {...register("zipCode", { required: "ZIP code is required" })}
                      className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                        errors.zipCode ? "border-red-500" : "focus:border-blue-500"
                      }`}
                    />
                    {errors.zipCode && <p className="text-sm text-red-400 mt-1">{errors.zipCode.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-white font-medium">
                    Country *
                  </Label>
                  <Select onValueChange={(value) => setValue("country", value)}>
                    <SelectTrigger className="bg-[#1a1a1a] border-gray-600 text-white h-12 focus:border-blue-500">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2a2a] border-gray-600">
                      <SelectItem value="us">🇺🇸 United States</SelectItem>
                      <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                      <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                      <SelectItem value="de">🇩🇪 Germany</SelectItem>
                      <SelectItem value="fr">🇫🇷 France</SelectItem>
                      <SelectItem value="ru">🇷🇺 Russia</SelectItem>
                      <SelectItem value="ae">🇦🇪 UAE</SelectItem>
                      <SelectItem value="sa">🇸🇦 Saudi Arabia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {paymentMethod === "card" && (
              <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-gray-600 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      4
                    </div>
                    Payment Information
                    <Lock className="h-5 w-5 text-green-400 ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-white font-medium">
                      Cardholder Name *
                    </Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      {...register("cardName", { required: "Cardholder name is required" })}
                      className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                        errors.cardName ? "border-red-500" : "focus:border-blue-500"
                      }`}
                    />
                    {errors.cardName && <p className="text-sm text-red-400 mt-1">{errors.cardName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-white font-medium">
                      Card Number *
                    </Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        {...register("cardNumber", {
                          required: "Card number is required",
                          onChange: (e) => {
                            e.target.value = formatCardNumber(e.target.value)
                          },
                        })}
                        className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 pl-12 h-12 ${
                          errors.cardNumber ? "border-red-500" : "focus:border-blue-500"
                        }`}
                        maxLength={19}
                      />
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.cardNumber && <p className="text-sm text-red-400 mt-1">{errors.cardNumber.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="text-white font-medium">
                        Expiry Date *
                      </Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        {...register("expiryDate", {
                          required: "Expiry date is required",
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                            message: "Invalid format (MM/YY)",
                          },
                        })}
                        className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                          errors.expiryDate ? "border-red-500" : "focus:border-blue-500"
                        }`}
                        maxLength={5}
                      />
                      {errors.expiryDate && <p className="text-sm text-red-400 mt-1">{errors.expiryDate.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-white font-medium">
                        CVV *
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        {...register("cvv", {
                          required: "CVV is required",
                          pattern: {
                            value: /^[0-9]{3,4}$/,
                            message: "Invalid CVV",
                          },
                        })}
                        className={`bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 h-12 ${
                          errors.cvv ? "border-red-500" : "focus:border-blue-500"
                        }`}
                        maxLength={4}
                      />
                      {errors.cvv && <p className="text-sm text-red-400 mt-1">{errors.cvv.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="saveCard"
                        checked={watchSaveCard}
                        onCheckedChange={(checked) => setValue("saveCard", checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-blue-600 w-5 h-5"
                      />
                      <Label htmlFor="saveCard" className="text-sm text-gray-300">
                        Save card for future purchases
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeToTerms"
                        checked={watchAgreeToTerms}
                        onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-blue-600 w-5 h-5 mt-0.5"
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm text-gray-300 leading-relaxed">
                        I agree to the{" "}
                        <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-gray-600 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white font-medium">{total.toFixed(2)} ₽</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Processing Fee:</span>
                    <span className="text-green-400 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Delivery:</span>
                    <span className="text-green-400 font-medium">Instant</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white text-lg">Total:</span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {total.toFixed(2)} ₽
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing || !watchAgreeToTerms}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 text-lg disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Complete Payment - {total.toFixed(2)} ₽
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">Your payment is secured with 256-bit SSL encryption</p>
                  <div className="flex justify-center space-x-4 opacity-60">
                    <img src="/visa-application-process.png" alt="Visa" className="h-6" />
                    <img src="/mastercard-logo-abstract.png" alt="Mastercard" className="h-6" />
                    <img src="/paypal-digital-payment.png" alt="PayPal" className="h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-xl border border-green-500/20">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-400" />
                <div>
                  <h4 className="text-white font-medium">100% Secure</h4>
                  <p className="text-gray-400 text-sm">Your data is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
