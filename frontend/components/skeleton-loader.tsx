"use client"

import { motion } from "framer-motion"

interface SkeletonProps {
  className?: string
  animate?: boolean
}

export function Skeleton({ className = "", animate = true }: SkeletonProps) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] rounded ${className}`}
      animate={animate ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } : {}}
      transition={animate ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" } : {}}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function ProductListSkeleton() {
  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
      <div className="flex gap-4">
        <Skeleton className="w-24 h-24 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CategoryIconSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-3 w-12" />
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 mb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
        <div className="flex space-x-4">
          <Skeleton className="w-32 h-20 rounded-lg" />
          <Skeleton className="w-32 h-20 rounded-lg" />
          <Skeleton className="w-32 h-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function ProductSliderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex space-x-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-64">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}

export function NavbarSkeleton() {
  return (
    <div className="bg-[#1a1a1a] border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-96 rounded-lg" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="border-t border-gray-700 py-3">
          <div className="flex items-center space-x-6">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CheckoutSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-6 space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
