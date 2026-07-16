import { useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'

export default function ProductsDisplayCard({
  products = [],
  title,
  eyebrow,
  viewAllLink = '/shop',
}) {
  const scrollRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const hasDragged = useRef(false)

  // Drag-to-scroll logic handlers
  const onMouseDown = useCallback((e) => {
    isDragging.current = true
    hasDragged.current = false
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = 'grabbing'
    scrollRef.current.style.userSelect = 'none'
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.2
    if (Math.abs(walk) > 4) hasDragged.current = true
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }, [])

  const onMouseUpOrLeave = useCallback(() => {
    isDragging.current = false
    scrollRef.current.style.cursor = 'grab'
    scrollRef.current.style.userSelect = ''
  }, [])

  const onLinkClick = useCallback((e) => {
    if (hasDragged.current) e.preventDefault()
  }, [])

  // Title Splitting Logic
  const titleWords = title.trim().split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleAccent = titleWords[titleWords.length - 1]

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 font-sans">

      {/* ── HEADER SECTION ── */}
      <div className="mb-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            {/* Eyebrow Subtitle */}
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E8001C]">
              <span className="h-0.5 w-4 rounded bg-[#E8001C]" />
              {eyebrow}
            </div>

            {/* Main Title */}
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {titleMain && <>{titleMain} </>}
              <span className="text-[#E8001C]">{titleAccent}</span>
            </h2>

          </div>

          {/* View All Link */}
          <Link
            to={viewAllLink}
            className="mb-1 flex items-center gap-1 border-b border-[#E8001C] pb-0.5 text-xs font-bold uppercase tracking-wider text-[#E8001C] no-underline whitespace-nowrap transition-opacity duration-150 hover:opacity-70"
          >
            View all
            <ArrowRight size={12} strokeWidth={2.5} />
          </Link>
        </div>

      </div>

      {/* ── SCROLLABLE PRODUCT ROW ── */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
        className="flex gap-5 py-3 overflow-x-auto scroll-smooth cursor-grab select-none flex-nowrap scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
      >
        {products.map((product) => {
          const rating = Math.round(product.rating || 0)
          const discountPct = product.discount > 0 ? product.discount : null;
          return (
            <Link
              key={product._id}
              to={`products/${product._id}`}
              onClick={onLinkClick}
              draggable={false}
              className="group shrink-0 w-60 cursor-pointer select-none rounded-2xl bg-white no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Product Image Wrapper */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-50">

                {/* Discount Badge */}
                {discountPct && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[#E8001C] px-2 py-0.5 text-[10px] font-bold text-white">
                    −{discountPct}%
                  </span>
                )}

                {/* Main Image */}
                <img
                  src={product.coverImage}
                  alt={product.name}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-300 ease-out group-hover:scale-105"
                />

                {/* Glassmorphic Price Tag Container */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/90 backdrop-blur-sm p-2.5 shadow-md">
                  <span className="text-sm font-bold text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Descriptions / Details */}
              <div className="space-y-1.5 px-1 py-3">
                {/* Star Ratings Row */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      strokeWidth={0}
                      fill={rating >= i + 1 ? '#E8001C' : '#D1D5DB'}
                    />
                  ))}
                  {product.reviewCount > 0 && (
                    <span className="ml-1 text-xs text-slate-400 font-mono">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-800">
                  {product.name}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}