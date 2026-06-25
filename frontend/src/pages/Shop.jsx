import { useState } from 'react'
import { getProducts} from '../services/productService'
import ProductCard from '../components/ProductCard'
import { useEffect } from 'react'
import { Search } from 'lucide-react'

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.data);

      } catch (error) {
        console.log(error)
      }
      finally{
        setLoading(false)
      }
    }

    fetchProducts();
  
  },[])
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filtered = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

return (
  <main className="max-w-5xl mx-auto px-8 py-14">

    {/* Page header */}
    <div className="border-b border-[#E2DDD8] pb-6 mb-10">
      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9A8C7E] mb-3
                    flex items-center gap-3 before:block before:w-6 before:h-px before:bg-[#9A8C7E]">
        Our collection
      </p>
      <h1 className="font-serif text-[42px] leading-none text-[#1A1A1A]">Shop</h1>
      <p className="text-[15px] text-[#9A8C7E] mt-2">
        Discover our full collection of curated products.
      </p>
    </div>

    {/* Filters row */}
    <div className="flex flex-col sm:flex-row gap-3 mb-8">

      {/* Search */}
      <div className="group relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5BFB8]
                           transition-colors duration-200 group-focus-within:text-[#1A1A1A]" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2DDD8] rounded-md text-[13px]
                     text-[#1A1A1A] placeholder:text-[#C5BFB8]
                     transition-all duration-200
                     focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/5"
        />
      </div>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        className="border border-[#E2DDD8] rounded-md px-4 py-2.5 text-[13px] text-[#6B6358]
                   bg-white transition-all duration-200
                   focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/5
                   hover:border-[#C5BFB8] cursor-pointer"
      >
        <option value="default">Sort: Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>

    {/* Category pills */}
    <div className="flex flex-wrap gap-2 mb-10">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-1.5 rounded-full text-[12px] font-medium uppercase tracking-wider
                      transition-all duration-200 active:scale-95
                      ${activeCategory === cat
                        ? 'bg-[#1A1A1A] text-[#FAFAF8] shadow-sm'
                        : 'bg-white border border-[#E2DDD8] text-[#9A8C7E] hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]'
                      }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Product grid / empty state */}
    {filtered.length === 0 ? (
      <div className="text-center py-24 border border-dashed border-[#E2DDD8] rounded-xl">
        <p className="font-serif text-2xl text-[#1A1A1A] mb-2">Nothing here.</p>
        <p className="text-[14px] text-[#9A8C7E]">Try a different search or category.</p>
        <button
          onClick={() => { setSearch(''); setActiveCategory('All'); }}
          className="mt-6 px-5 py-2 border border-[#E2DDD8] rounded-md text-[13px] text-[#6B6358]
                     transition-all duration-200 hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                     active:scale-95"
        >
          Clear filters
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    )}
  </main>
)
}
