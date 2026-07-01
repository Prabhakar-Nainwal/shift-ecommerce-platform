import { useState, useEffect, useRef } from 'react'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom' 
import Loader from '../components/Loader'
import { getCategories } from "../services/categoryServices"

export default function Shop() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]);
  const [isCategoryInitialized, setIsCategoryInitialized] = useState(false);
  const location = useLocation();
  const scrollContainerRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const fetchedCategories = res.data.data.filter(cat => cat.isActive);

      setCategories([
        { _id: "All", name: "All", image: null },
        ...fetchedCategories,
      ]);

      const queryParams = new URLSearchParams(location.search);
      const categoryNameFromUrl = queryParams.get('category');

      let targetCategoryId = 'All';
      if (categoryNameFromUrl) {
        const matchedCategory = fetchedCategories.find(
          (cat) => cat.name.toLowerCase() === categoryNameFromUrl.toLowerCase()
        );
        if (matchedCategory) {
          targetCategoryId = matchedCategory._id;
        }
      }

      setActiveCategory(targetCategoryId);
      setIsCategoryInitialized(true);
    } catch (error) {
      console.log(error);
      setIsCategoryInitialized(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [location.search]);


  useEffect(() => {
    if (!isCategoryInitialized) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts(search, activeCategory, page);
        setProducts(prev => page === 1 ? res.data.data : [...prev, ...res.data.data]);
        setHasMore(res.data.hasMore);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, activeCategory, page, isCategoryInitialized]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom) setPage(prev => prev + 1);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const filtered = products
    .filter(p => p.isActive)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "discount") return b.discount - a.discount;
      return 0;
    });

  const handleSearchChange = (e) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const handleCategoryChange = (catId) => {
    if (catId === activeCategory) return;
    setPage(1);
    setActiveCategory(catId);
  };

  // Scroll handler functions
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust scroll distance per click
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-white">
      <style>{`
        .product-card-link .product-img-box {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 0.75rem;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-card-link .product-img-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          padding: 0.75rem;
        }
        .product-card-link:hover .product-img-box img {
          transform: scale(1.12);
        }
      `}</style>

      {/* Categories Horizontal Scroller */}
      <div
        ref={scrollContainerRef}
        className="flex items-start gap-6 md:gap-8 overflow-x-auto pt-4 pb-8 mb-6 scroll-smooth snap-x scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => {
            const isActive = activeCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat._id)}
                className="group flex flex-col items-center flex-shrink-0 w-24 md:w-28 text-center snap-start focus:outline-none"
              >
                {/* Circle Image Container */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-3">
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300
                      ${isActive
                        ? 'bg-red-50 border border-red-200 shadow-md scale-105'
                        : 'bg-slate-100 group-hover:bg-slate-200/80 group-hover:shadow-sm'
                      }`}
                  />

                  {/* Category Icon / Image */}
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="relative z-10 w-10 h-10 md:w-12 md:h-12 object-contain mix-blend-multiply transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                    />
                  ) : (
                    <span className="relative z-10 text-2xl md:text-3xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                      {cat.name === 'All' ? '📦' : '🎧'}
                    </span>
                  )}
                </div>

                {/* Category Label */}
                <span
                  className={`text-xs md:text-sm font-semibold tracking-tight px-1 transition-colors duration-200 line-clamp-2 min-h-[2.5rem]
                    ${isActive ? 'text-[#E8001C] font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="group relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors duration-200 group-focus-within:text-red-600" />
          <input
            type="text"
            placeholder="Search our ecosystem..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-black placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/5"
          />
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-40 sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-600 bg-white transition-all duration-200 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/5 hover:border-gray-400 cursor-pointer"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="discount">Most Discounted</option>

        </select>
      </div>

      {/* Product Content Matrix Grid Area */}
      {loading && page === 1 ? (
        <div className="flex items-center justify-center h-[40vh]"><Loader /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <p className="text-xl font-bold text-black mb-1">No products found</p>
          <p className="text-[13px] text-gray-400">Try adjusting your search criteria or category filter.</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('All'); setPage(1); }}
            className="mt-5 px-5 py-2.5 bg-black text-white rounded-xl text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 hover:bg-red-600 active:scale-95"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
          {filtered.map(p => (
            <Link to={`/products/${p._id}`} key={p._id} className="group product-card-link">
              <div className="[&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out [&_img]:group-hover:scale-110 [&_img]:w-full [&_img]:h-full [&_img]:object-contain">
                <ProductCard product={p} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {loading && page > 1 && products.length > 0 && (
        <div className="py-8 text-center text-[12px] font-medium uppercase tracking-widest text-red-600 animate-pulse">
          Syncing more gear...
        </div>
      )}
    </main>
  )
}