import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.coverImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
            product.badge === 'Sale' ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'
          }`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <StarIcon />
          <span className="text-xs text-gray-500">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="text-sm bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

const StarIcon = () => (
  <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)
