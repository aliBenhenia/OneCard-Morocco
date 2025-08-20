"use client"

import { motion } from "framer-motion"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Clock,
  Users,
} from "lucide-react"
import Link from "next/link"

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
  ]

  const categories = [
    { name: "Gaming Cards", href: "/gaming" },
    { name: "Mobile Recharge", href: "/mobile" },
    { name: "Entertainment", href: "/entertainment" },
    { name: "Shopping Cards", href: "/shopping" },
    { name: "Subscriptions", href: "/subscriptions" },
    { name: "Digital Wallets", href: "/wallets" },
  ]

  const features = [
    { icon: Shield, text: "Secure Payments" },
    { icon: Clock, text: "24/7 Support" },
    { icon: CreditCard, text: "Instant Delivery" },
    { icon: Users, text: "Trusted by 1M+" },
  ]

  return (
    <footer className="bg-[#0f0f0f] border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-sm">TC</span>
              </div>
              <span className="text-white text-xl font-semibold">OneCard</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted digital marketplace for gift cards, gaming credits, and mobile recharges. Fast, secure, and
              reliable service since 2020.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@onecard.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link href={category.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Features & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Why Choose Us</h3>
              <div className="space-y-3">
                {features.map((feature) => {
                  const IconComponent = feature.icon
                  return (
                    <div key={feature.text} className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-400 text-sm">{feature.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Follow Us</h3>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <IconComponent className="h-5 w-5 text-gray-400 hover:text-white" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border-t border-gray-800 py-6"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">© 2024 OneCard. All rights reserved.</div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <img src="/visa-application-process.png" alt="Visa" className="h-6" />
                <img src="/mastercard-logo-abstract.png" alt="Mastercard" className="h-6" />
                <img src="/paypal-digital-payment.png" alt="PayPal" className="h-6" />
                <img src="/digital-wallet-payment.png" alt="Apple Pay" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
