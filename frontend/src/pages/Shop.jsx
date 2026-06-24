import { useState } from 'react'
import { getProducts} from '../services/productService'
import ProductCard from '../components/ProductCard'
import { useEffect } from 'react'

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
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
      <p className="text-gray-400 mb-8">Discover our full collection of curated products.</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-400"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-brand-400"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No products found.</p>
          <p className="text-sm mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </main>
  )
}
