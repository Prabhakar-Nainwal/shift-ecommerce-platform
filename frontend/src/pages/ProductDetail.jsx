import { useEffect, useState } from 'react'
import { ChevronLeft, Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronRight } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
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
// ─────────────────────────────────────────────────────────────────────────────

function StarRow({ rating, count }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-[#C07B4A] text-[#C07B4A]' : 'fill-[#E2DDD8] text-[#E2DDD8]'}`}
          />
        ))}
      </div>
      <span className="text-[12px] text-[#9A8C7E]">{rating} · {count} reviews</span>
    </div>
  )
}

function SuggestionCard({ product }) {
  const [wished, setWished] = useState(false)

  return (
    <div className="group relative bg-white border border-[#E2DDD8] rounded-xl overflow-hidden
                    transition-all duration-300 hover:border-[#C5BFB8] hover:shadow-md hover:-translate-y-0.5">
      <div className="relative overflow-hidden bg-[#F5F2EE] aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => setWished(w => !w)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-sm
                     opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${wished ? 'fill-rose-500 text-rose-500' : 'text-[#9A8C7E]'}`} />
        </button>
      </div>
      <div className="p-3.5">
        <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#9A8C7E] mb-1">{product.category}</p>
        <p className="text-[13px] font-medium text-[#1A1A1A] leading-snug mb-2 line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-1 mb-2.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'fill-[#C07B4A] text-[#C07B4A]' : 'fill-[#E2DDD8] text-[#E2DDD8]'}`} />
          ))}
          <span className="text-[11px] text-[#9A8C7E] ml-0.5">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-serif text-[16px] text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
          <button className="text-[11px] font-medium uppercase tracking-wider text-[#6B6358]
                             border border-[#E2DDD8] rounded-full px-3 py-1
                             hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                             transition-all duration-200 active:scale-95">
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const {user} = useAuth()
  const navigate = useNavigate()
  const { addToCart, updateQty, cartItems } = useCart()
  const [product, setProduct] = useState(null)
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)


  const fetchProduct = async () => {
    const res = await getProduct(id)
    setProduct(res.data.data)
  }
  useEffect(() => {
    fetchProduct();
  }, [id])

  useEffect(() => {
    if (!product?.images?.length) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product]);

  if (!product) {
    return <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">Loading...</div>;
  }

  const discount = product.discountPercentage
  const handleAddToCart = async () => {
    if(!user){ return navigate("/login",{replace:true})}
    await addToCart(product._id, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const discountPrice = product.price - (product.price * product.discountPercentage) / 100;

  const saveAmount = product.price - discountPrice;

  return (
    <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#9A8C7E] mb-8">
        <button className="hover:text-[#1A1A1A] transition-colors">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button className="hover:text-[#1A1A1A] transition-colors">Shop</button>
        <ChevronRight className="w-3 h-3" />
        <button className="hover:text-[#1A1A1A] transition-colors">{product.category}</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1A1A1A] font-medium truncate max-w-[160px]">{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-16">

        {/* ── Left: Images ── */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0
                            ${activeImage === i ? 'border-[#1A1A1A]' : 'border-[#E2DDD8] hover:border-[#C5BFB8]'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 relative bg-[#F5F2EE] rounded-2xl overflow-hidden aspect-square">
            <img
              key={activeImage}
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#1A1A1A] text-[#FAFAF8] text-[11px]
                               font-medium tracking-wider uppercase px-2.5 py-1 rounded-full">
                −{discount}%
              </span>
            )}
            <button
              onClick={() => setWished(w => !w)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm
                         hover:bg-white transition-all duration-200"
            >
              <Heart className={`w-4 h-4 transition-colors ${wished ? 'fill-rose-500 text-rose-500' : 'text-[#9A8C7E]'}`} />
            </button>
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div className="flex flex-col">

          {/* Category eyebrow */}
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9A8C7E] mb-3
                        flex items-center gap-3 before:block before:w-6 before:h-px before:bg-[#9A8C7E]">
            {product.category}
          </p>

          <h1 className="font-serif text-[34px] leading-tight text-[#1A1A1A] mb-3">{product.name}</h1>

          <StarRow rating={product.rating} count={product.numReviews} />

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5 mb-6">
            <span className="font-serif text-[32px] text-[#1A1A1A]">₹{discountPrice.toLocaleString()}</span>
            <span className="text-[15px] text-[#C5BFB8] line-through">₹{product.price.toLocaleString()}</span>
            <span className="text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Save ₹{saveAmount.toLocaleString()}
            </span>
          </div>

          <div className="w-full h-px bg-[#E2DDD8] mb-6" />

          {/* Variant selector */}
          {/* <div className="mb-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#6B6358] mb-3">
              Colour — <span className="font-normal normal-case tracking-normal text-[#9A8C7E]">{activeVariant}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(v => (
                <button
                  key={v}
                  onClick={() => setActiveVariant(v)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 active:scale-95
                              ${activeVariant === v
                      ? 'bg-[#1A1A1A] text-[#FAFAF8] shadow-sm'
                      : 'bg-white border border-[#E2DDD8] text-[#9A8C7E] hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]'
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div> */}

          {/* Qty + CTA */}
          <div className="flex items-center gap-3 mb-4">
            {/* Qty stepper */}
            <div className="flex items-center border border-[#E2DDD8] rounded-md overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-3 py-2.5 text-[#6B6358] hover:bg-[#F0ECE7] transition-colors text-[14px] font-medium"
              >−</button>
              <span className="px-4 py-2.5 text-[13px] font-medium text-[#1A1A1A] min-w-[2.5rem] text-center border-x border-[#E2DDD8]">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="px-3 py-2.5 text-[#6B6358] hover:bg-[#F0ECE7] transition-colors text-[14px] font-medium"
              >+</button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-[13px] font-medium
                          tracking-wide uppercase transition-all duration-300 active:scale-[0.98]
                          ${addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1A1A1A] text-[#FAFAF8] hover:bg-[#2D2D2D]'
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </button>

            {/* Share */}
            <button className="p-2.5 border border-[#E2DDD8] rounded-md text-[#9A8C7E]
                               hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                               transition-all duration-200">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Stock notice */}
          <p className="text-[12px] text-amber-600 mb-6">
            Only {product.stock} left in stock — order soon.
          </p>

          <div className="w-full h-px bg-[#E2DDD8] mb-6" />

          {/* Description */}
          <p className="text-[14px] text-[#6B6358] leading-relaxed mb-6">{product.description}</p>

          {/* Highlights */}
          <ul className="space-y-2 mb-7">
            {product.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#6B6358]">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-[#F0ECE7] flex items-center justify-center flex-shrink-0">
                  <span className="block w-1.5 h-1.5 rounded-full bg-[#C07B4A]" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-3 border border-[#E2DDD8] rounded-xl p-4">
            {[
              { icon: Truck, label: 'Free delivery', sub: 'Orders above ₹999' },
              { icon: RotateCcw, label: 'Easy returns', sub: '7-day return policy' },
              { icon: Shield, label: 'Secure pay', sub: 'Encrypted checkout' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-[#F5F2EE] flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#6B6358]" />
                </div>
                <p className="text-[11px] font-medium text-[#1A1A1A]">{label}</p>
                <p className="text-[10px] text-[#9A8C7E]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Suggestions ── */}
      <div className="border-t border-[#E2DDD8] pt-10">
        <div className="flex items-baseline justify-between mb-7">
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9A8C7E] mb-1.5
                          flex items-center gap-3 before:block before:w-6 before:h-px before:bg-[#9A8C7E]">
              You may also like
            </p>
            <h2 className="font-serif text-[26px] text-[#1A1A1A]">Complete the look</h2>
          </div>
          <button className="text-[12px] font-medium uppercase tracking-wider text-[#6B6358]
                             flex items-center gap-1 hover:text-[#1A1A1A] transition-colors group">
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