import React from "react";
import { Link, useNavigate } from "react-router-dom";


export default function CategorySection({ categories }) {
  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-red-600">
            <span className="h-px w-8 bg-red-600" />
            Explore
            <span className="h-px w-8 bg-red-600" />
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Shop by <span className="text-red-600">Categories</span>
          </h2>
          <p className="mt-3 text-neutral-500 max-w-xl">
            Discover premium audio, wearables and accessories crafted for performance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-50 to-neutral-100 border border-neutral-200 hover:border-red-500 hover:shadow-xl hover:shadow-red-600/10 transition-all duration-300 aspect-square p-4"
            >


              {/* Image */}
              <div className="flex-1 w-full flex items-center justify-center p-4 min-h-[140px] sm:min-h-[180px]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain object-center drop-shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Label */}
              <div className="relative z-10 w-full text-center">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 group-hover:text-red-600 transition-colors">
                  Shop now
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/* Bottom accent bar */}
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-red-600 to-black group-hover:w-full transition-all duration-500" />
            </Link>
          ))}

          {/* View All tile */}
          <a
            href="#"
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-black via-neutral-900 to-red-700 text-white aspect-square p-6 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300"
          >
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.4),transparent_60%)]" />
            <div className="relative z-10 text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 group-hover:bg-red-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold">View All</h3>
              <p className="text-xs text-white/70 mt-1">Full catalog</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
