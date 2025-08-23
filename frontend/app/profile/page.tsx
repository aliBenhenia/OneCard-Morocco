"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  User, 
  ShoppingBag, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Star, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  BadgeInfo,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/api"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState({
    profile: true,
    orders: true,
    payments: true
  })
  const [error, setError] = useState(null)
  const router = useRouter()

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }
      try {
        setLoading(prev => ({ ...prev, profile: true }))
        const response = await api.get("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.data.success) {
          setUser(response.data.user)
        }
      } catch (err) {
        setError("Failed to load profile data")
        console.error("Profile fetch error:", err)
      } finally {
        setLoading(prev => ({ ...prev, profile: false }))
      }
    }

    fetchProfile()
  }, [])

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(prev => ({ ...prev, orders: true }))
        const response = await api.get("/api/payment/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })

        if (response.data.success) {
          setOrders(response.data.orders)
        }
      } catch (err) {
        setError("Failed to load orders")
        console.error("Orders fetch error:", err)
      } finally {
        setLoading(prev => ({ ...prev, orders: false }))
      }
    }

    fetchOrders()
  }, [])

  // Fetch payment history
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(prev => ({ ...prev, payments: true }))
        // Assuming you have a payments endpoint
        // If not, you might need to extract payments from orders
        const response = await api.get("/api/payments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        if (response.data.success) {
          setPayments(response.data.payments)
        }
      } catch (err) {
        // Fallback: extract payments from orders if separate endpoint doesn't exist
        try {
          const ordersResponse = await api.get("/api/payment/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          if (ordersResponse.data.success) {
            // Extract unique payment IDs from orders
            const paymentIds = [...new Set(ordersResponse.data.orders
              .filter(order => order.paymentId)
              .map(order => order.paymentId))]
            
            // For now, we'll just use orders as payment data
            setPayments(ordersResponse.data.orders.map(order => ({
              _id: order.paymentId,
              orderId: order.orderId,
              amount: order.totalAmount,
              status: order.status,
              paymentMethod: 'card', // Default value
              createdAt: order.createdAt,
              currency: 'USD'
            })))
          }
        } catch (fallbackErr) {
          setError("Failed to load payment history")
          console.error("Payments fetch error:", err)
        }
      } finally {
        setLoading(prev => ({ ...prev, payments: false }))
      }
    }

    fetchPayments()
  }, [])

  // Handle logout
  const handleLogout = () => {
    // Clear any stored tokens
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    // Redirect to login page
    router.push('/login')
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: "Completed", variant: "default" },
      processing: { label: "Processing", variant: "secondary" },
      shipped: { label: "Shipped", variant: "default" },
      delivered: { label: "Delivered", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" },
      pending: { label: "Pending", variant: "secondary" },
      failed: { label: "Failed", variant: "destructive" },
      refunded: { label: "Refunded", variant: "outline" }
    }
    
    const config = statusConfig[status] || { label: status, variant: "secondary" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />
      case 'digital-wallet':
        return <CreditCard className="h-4 w-4" />
      case 'mobile':
        return <Phone className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 border border-red-700 rounded-xl max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Account</h1>
              <p className="text-muted-foreground">Manage your profile, orders, and payment methods</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  {loading.profile ? (
                    <Skeleton className="h-16 w-16 rounded-full" />
                  ) : (
                    <div className="relative">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-background">
                        <div className="bg-background rounded-full p-0.5">
                          <div className="bg-green-500 rounded-full w-2 h-2"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    {loading.profile ? (
                      <>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </>
                    ) : (
                      <>
                        <h2 className="text-lg font-semibold text-foreground">
                          {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-sm text-muted-foreground">Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  {[
                    { id: "profile", label: "Profile", icon: User },
                    { id: "orders", label: "My Orders", icon: ShoppingBag },
                    { id: "payments", label: "Payment History", icon: CreditCard }
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => setActiveTab(item.id)}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loading.profile ? (
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">{user?.firstName} {user?.lastName}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">{user?.email}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">{orders.length}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Total Spent</label>
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">
                              {formatCurrency(orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-border">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Order History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.orders ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-24 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-1">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">Your orders will appear here once you make a purchase</p>
                        <Button>Start Shopping</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order._id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-foreground">Order #{order.orderId?.slice(0, 8)}</span>
                                  {getStatusBadge(order.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">{formatCurrency(order.totalAmount)}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  {getPaymentMethodIcon('card')}
                                  <span className="capitalize">Card Payment</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {order.items?.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                                  <div className="bg-background border border-border rounded w-8 h-8 flex items-center justify-center">
                                    <span className="text-xs font-medium text-foreground">
                                      {item.name?.charAt(0)}
                                    </span>
                                  </div>
                                  <span className="text-sm text-foreground">{item.name}</span>
                                </div>
                              ))}
                              {order.items?.length > 3 && (
                                <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                                  <span className="text-sm text-foreground">
                                    +{order.items.length - 3} more
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {order.status === "delivered" && (
                                <Button variant="outline" size="sm">
                                  <Star className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "payments" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.payments ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : payments.length === 0 ? (
                      <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-1">No payment history</h3>
                        <p className="text-muted-foreground">Your payment history will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {payments.map((payment) => (
                          <div key={payment._id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${payment.status === 'completed' ? 'bg-green-500/20' : payment.status === 'failed' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                                  {payment.status === 'completed' ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : payment.status === 'failed' ? (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  ) : (
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">Payment #{payment.orderId?.slice(0, 8)}</span>
                                    {getStatusBadge(payment.status)}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{formatDate(payment.createdAt)}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getPaymentMethodIcon(payment.paymentMethod)}
                                  <span className="capitalize text-foreground">{payment.paymentMethod}</span>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-foreground">{formatCurrency(payment.amount)}</p>
                                  <p className="text-sm text-muted-foreground">{payment.currency}</p>
                                </div>
                              </div>
                            </div>
                            
                            {payment.cardInfo && (
                              <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {payment.cardInfo.brand} ending in {payment.cardInfo.last4} 
                                  (Exp: {payment.cardInfo.expiryMonth}/{payment.cardInfo.expiryYear})
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}