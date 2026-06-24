import React from 'react'

export default function NoPageFound() {
  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col items-center justify-center px-4 font-sans">

      {/* 404 Visual */}
      <div className="relative mb-6">
        <span className="text-[140px] md:text-[180px] font-black text-[#ECDDD0] leading-none select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🛍️</span>
        </div>
      </div>

      {/* Text */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3 text-center">
        Page Not Found
      </h1>
      <p className="text-gray-500 text-sm md:text-base text-center max-w-sm mb-8">
        Oops! The page you're looking for doesn't exist or has been moved. Let's get you back to shopping.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="/"
          className="bg-[#E85D26] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#d04e1e] transition-colors"
        >
          Go to Homepage
        </a>
        <a
          href="/shop"
          className="bg-white border border-gray-200 text-gray-700 px-7 py-2.5 rounded-full text-sm font-semibold hover:border-[#E85D26] hover:text-[#E85D26] transition-colors"
        >
          Browse Products
        </a>
      </div>

      {/* Support link */}
      <p className="mt-10 text-xs text-gray-400">
        Need help?{" "}
        <a href="/contact" className="text-[#E85D26] hover:underline font-medium">
          Contact Support
        </a>
      </p>
    </div>
  );
}