import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login") }
    else { await addToCart(product._id) }
  }

  return (
    <div className="group bg-white border border-[#E2DDD8] rounded-xl overflow-hidden
                    transition-all duration-300
                    hover:border-[#C5BFB8] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]">

      {/* Image */}
      <div className="relative aspect-square bg-[#F0ECE7] overflow-hidden">
        <img
          src={product.coverImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold uppercase tracking-wider
                            px-2 py-1 rounded
                            ${product.badge === 'Sale'
              ? 'bg-[#F7C1C1] text-[#791F1F]'
              : 'bg-[#1A1A1A] text-[#FAFAF8]'
            }`}>
            {product.badge}
          </span>
        )}

        {/* Quick-add overlay — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0
                        translate-y-full group-hover:translate-y-0
                        transition-transform duration-300 ease-out">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#1A1A1A] text-[#FAFAF8] py-3
                       text-[11px] font-semibold uppercase tracking-widest
                       transition-colors duration-150 hover:bg-[#333]
                       active:scale-[0.98]"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-[#C5BFB8] mb-1.5">
          {product.category}
        </p>
        <h3 className="text-[13px] font-medium text-[#1A1A1A] mb-2 truncate
                       transition-colors duration-200 group-hover:text-[#C8A97E]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <StarIcon />
          <span className="text-[12px] text-[#9A8C7E]">{product.rating}</span>
        </div>

        {/* Price row — button hidden on desktop (slide-up handles it), visible on touch */}
        <div className="flex items-center justify-between">
          <span className="font-serif text-[17px] text-[#1A1A1A]">${product.price}</span>
          <button
            onClick={() => addToCart(product._id)}
            className="sm:hidden text-[11px] font-semibold uppercase tracking-wider
                       bg-[#1A1A1A] text-[#FAFAF8] px-3 py-1.5 rounded
                       transition-all duration-150 active:scale-95"
          >
            Add
          </button>
          {/* Desktop: subtle plus icon, always tappable as fallback */}
          <button
            onClick={() => addToCart(product._id)}
            aria-label="Add to cart"
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full
                       border border-[#E2DDD8] text-[#9A8C7E]
                       transition-all duration-200
                       hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                       active:scale-90 opacity-0 group-hover:opacity-100"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

const StarIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)