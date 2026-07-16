import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Star, ShoppingBag } from 'lucide-react'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/login')
    } else {
      await addToCart(product._id)
    }
  }

  const rating = Math.round(product.rating || 0)
  const discountPct =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null

  return (
    <div className="group w-full max-w-[220px] cursor-pointer select-none">

      {/* ── Image card ───────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-[#F0F2F5] aspect-[4/5]">

        {/* Discount badge */}
        {discountPct && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#00C950] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
            −{discountPct}%
          </span>
        )}

        {/* Product image */}
        <img
          src={product.coverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(.22,.68,0,1.2)] group-hover:scale-110"
        />

        {/* Floating price pill — always visible on the image */}
        <div className="absolute bottom-3 left-3 bg-[#111111] text-white rounded-full px-3 py-1 flex items-baseline gap-1.5 shadow-lg">
          <span className="text-sm font-bold tracking-tight">₹{product.price}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-[10px] text-white/45 line-through leading-none">₹{product.mrp}</span>
          )}
        </div>

        {/* Add to cart slide-up */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#00C950] hover:bg-[#00b347] active:bg-[#009e3e] text-white flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest transition-colors duration-150"
          >
            <ShoppingBag size={13} strokeWidth={2.5} />
            Add to cart
          </button>
        </div>
      </div>

      {/* ── Info ─────────────────────────────────────────────────── */}
      <div className="pt-3 space-y-1 px-0.5">

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              strokeWidth={0}
              fill={rating >= i + 1 ? '#00C950' : '#D1D5DB'}
            />
          ))}
          {product.reviewCount > 0 && (
            <span className="text-[10px] text-gray-400 ml-1">({product.reviewCount})</span>
          )}
        </div>

        {/* Name */}
        <p className="text-[13px] font-medium text-[#0F0F0F] leading-snug line-clamp-2">
          {product.name}
        </p>

      </div>
    </div>
  )
}