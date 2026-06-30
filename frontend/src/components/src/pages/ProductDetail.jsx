import { useEffect, useState } from 'react'
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '../services/productService'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const suggestions = [
  {
    _id: 's1',
    name: 'Linen Tea Towel',
    category: 'Home & Living',
    price: 649,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    _id: 's2',
    name: 'Bamboo Tray Set',
    category: 'Home & Living',
    price: 1099,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  },
  {
    _id: 's3',
    name: 'Soy Wax Candle',
    category: 'Wellness',
    price: 799,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=80',
  },
  {
    _id: 's4',
    name: 'Stone Coaster Pack',
    category: 'Home & Living',
    price: 549,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  },
]

function StarRow({ rating, count }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400">{rating} · {count} reviews</span>
    </div>
  )
}

function SuggestionCard({ product }) {
  const [wished, setWished] = useState(false)
  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button
          onClick={() => setWished(w => !w)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${wished ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
        </button>
      </div>
      <div className="p-3.5">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">{product.category.name}</p>
        <p className="text-sm font-medium text-slate-800 leading-snug mb-2 line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
          ))}
          <span className="text-[11px] text-slate-400 ml-0.5">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900">₹{product.price.toLocaleString()}</span>
          <button className="text-xs font-semibold uppercase tracking-wider text-slate-600 border border-slate-200 rounded-full px-3 py-1 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200 active:scale-95">
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const fetchProduct = async () => {
    const res = await getProduct(id)
    setProduct(res.data.data)
  }

  useEffect(() => { fetchProduct() }, [id])

  useEffect(() => {
    if (!product?.images?.length) return
    const interval = setInterval(() => {
      setActiveImage(prev => (prev + 1) % product.images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [product])

  if (!product) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const hasDiscount = product.mrp && product.mrp > product.price;
  const saveAmount = hasDiscount ? product.mrp - product.price : 0;
  const discountPercentage = hasDiscount ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const handleAddToCart = async () => {
    if (!user) return navigate('/login', { replace: true })
    await addToCart(product._id, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10 bg-white">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-10">
        <button className="hover:text-slate-900 transition-colors">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button className="hover:text-slate-900 transition-colors">Shop</button>
        <ChevronRight className="w-3 h-3" />
        <button className="hover:text-slate-900 transition-colors">{product.category?.name}</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium truncate max-w-[160px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0
                  ${activeImage === i ? 'border-slate-900 scale-95' : 'border-transparent hover:border-slate-200'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 relative bg-slate-50 rounded-3xl overflow-hidden aspect-square">
            <img
              key={activeImage}
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-slate-900 text-white text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
                −{discountPercentage}%
              </span>
            )}
            <button
              onClick={() => setWished(w => !w)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
            >
              <Heart className={`w-4 h-4 transition-colors ${wished ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-4">
            {product.category.name}
          </span>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
            {product.name}
          </h1>
          <StarRow rating={product.rating} count={product.numReviews} />

          <div className="flex items-baseline gap-3 mt-6 mb-8">
            {/* Now displaying product.price as the final selling price */}
            <span className="text-4xl font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
            {hasDiscount && (
              <>
                {/* Now displaying product.mrp as the crossed-out original price */}
                <span className="text-lg text-slate-300 line-through font-medium">₹{product.mrp.toLocaleString()}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Save ₹{saveAmount.toLocaleString()}
                </span>
              </>
            )}
          </div>
          <hr className="border-slate-100 mb-8" />

          <p className="text-sm text-slate-500 leading-relaxed mb-6">{product.description}</p>

          {product.highlights?.length > 0 && (
            <ul className="space-y-2 mb-8">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-900 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          {product.stock <= 10 && (
            <p className="text-xs font-medium text-amber-500 mb-5">
              Only {product.stock} left in stock
            </p>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-base font-medium"
              >−</button>
              <span className="px-4 py-3 text-sm font-semibold text-slate-900 min-w-[3rem] text-center border-x border-slate-100">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-base font-medium"
              >+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold
                tracking-wide uppercase transition-all duration-300 active:scale-[0.98]
                ${addedToCart
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-700'
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedToCart ? 'Added to cart!' : 'Add to Cart'}
            </button>

            <button className="p-3.5 border border-slate-200 rounded-xl text-slate-400 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: Truck, label: 'Free delivery', sub: 'Above ₹999' },
              { icon: RotateCcw, label: 'Easy returns', sub: '7-day policy' },
              { icon: Shield, label: 'Secure pay', sub: 'Encrypted' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <Icon className="w-4 h-4 text-slate-500" />
                <p className="text-[11px] font-semibold text-slate-700">{label}</p>
                <p className="text-[10px] text-slate-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-12">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-1.5">You may also like</p>
            <h2 className="text-2xl font-bold text-slate-900">Complete the look</h2>
          </div>
          <button className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1 hover:text-slate-900 transition-colors group">
            View all
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {suggestions.map(p => <SuggestionCard key={p._id} product={p} />)}
        </div>
      </div>
    </main>
  )
}