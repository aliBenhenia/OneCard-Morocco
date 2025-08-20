"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Shield, Award, Users, TrendingUp, Headphones, Gift, CheckCircle, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutPage() {
  const [expandedReview, setExpandedReview] = useState<number | null>(null)

  const features = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Best Prices",
      description: "Competitive pricing with exclusive deals and discounts",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Premium Support",
      description: "24/7 customer support with dedicated assistance",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Variety of Products",
      description: "Thousands of digital products across multiple categories",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Trusted by Thousands",
      description: "Join our community of satisfied customers",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const reviews = [
    {
      id: 1,
      name: "فايز مرزوق الشمري",
      date: "2023-06-27",
      rating: 5,
      content: "اول مره استخدم التطبيق والخدمه بشكل عام حقيقة تفاجأت بسهولة و توفر العديد من المنتجات وتكفيك عناء البحث عن مراكز التوزيع في المولات شكراً لكم والى مزيد من التقدم",
      excerpt: "اول مره استخدم التطبيق والخدمه بشكل عام حقيقة تفاجأت بسهولة و توفر..."
    },
    {
      id: 2,
      name: "احمد العنزي",
      date: "2023-08-13",
      rating: 5,
      content: "يمين بالله البرنامج رهيب ورايق وسهل الاستخدام ومتوفر فيه اغلب البطايق التسوق",
      excerpt: "يمين بالله البرنامج رهيب ورايق وسهل الاستخدام..."
    },
    {
      id: 3,
      name: "فرات عبدالرحمن",
      date: "2023-09-01",
      rating: 5,
      content: "سهولة تحكم سرعة استجابة بسم الله ماشاءالله اسعار نفس قيمة البطاقة مو مثل باقي التطبيقات اتمنى تبقون على ما انتهم وربي يفتحها عليكم",
      excerpt: "سهولة تحكم سرعة استجابة بسم الله ماشاءالله..."
    },
    {
      id: 4,
      name: "حسين علوان خليل بابلي",
      date: "2023-04-22",
      rating: 5,
      content: "كانت ممتازه جدا",
      excerpt: "كانت ممتازه جدا"
    },
    {
      id: 5,
      name: "ماجد الشرعبي",
      date: "2023-04-23",
      rating: 5,
      content: "ممتاز",
      excerpt: "ممتاز"
    },
    {
      id: 6,
      name: "طارق خميس محمد ابو عزام",
      date: "2023-04-24",
      rating: 5,
      content: "ممتاز..al in english",
      excerpt: "ممتاز..al in english"
    }
  ]

  const toggleReview = (id: number) => {
    setExpandedReview(expandedReview === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why <span className="text-yellow-300">OneCard</span>?
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
              Our goal is to provide you the best shopping experience with instant digital delivery
            </p>
            <div className="flex items-center justify-center space-x-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-gray-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-gray-200">Digital Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-gray-200">Average Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">What Makes Us Special</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover why thousands of customers choose OneCard for their digital needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "99.9%", label: "Delivery Success Rate", icon: <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" /> },
              { number: "24/7", label: "Customer Support", icon: <Headphones className="h-8 w-8 text-blue-400 mx-auto mb-2" /> },
              { number: "15K+", label: "Products Available", icon: <Gift className="h-8 w-8 text-purple-400 mx-auto mb-2" /> },
              { number: "4.9/5", label: "Customer Rating", icon: <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {stat.icon}
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-400">Real reviews from real customers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-white font-semibold">{review.name}</h4>
                      <p className="text-gray-400 text-sm">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Quote className="h-6 w-6 text-purple-400 mb-2" />
                  <p className="text-gray-300 mb-4">
                    {expandedReview === review.id ? review.content : review.excerpt}
                  </p>
                  {review.content.length > review.excerpt.length && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                      onClick={() => toggleReview(review.id)}
                    >
                      {expandedReview === review.id ? "Read Less" : "Read More"}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              See All Reviews
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience OneCard?</h2>
            <p className="text-xl text-gray-100 mb-8">
              Join thousands of satisfied customers and discover the future of digital shopping
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Now
              </Button>
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}