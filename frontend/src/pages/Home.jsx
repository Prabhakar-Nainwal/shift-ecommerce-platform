import { Link } from 'react-router-dom'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { useState, useEffect } from 'react'

export default function Home() {
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
      finally {
        setLoading(false)
      }
    }

    fetchProducts();

  }, [])


  const newProducts = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).sort((a, b) => b.rating - a.rating).slice(0, 4)
  const heroImages = products.slice(0, 4).map(p => p.coverImage);
  return (
    <main className="bg-[#FAFAF8] font-sans text-[#1A1A1A]">

      {/* Auto Sliding Hero */}
      <section className="overflow-hidden border-b border-[#E2DDD8] bg-white p-16">
      
      
        <div className="flex w-max animate-slider">
          {[...heroImages, ...heroImages].map((img, index) => (
            <div
              key={index}
              className="w-screen h-[450px] flex-shrink-0 overflow-hidden"
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#E2DDD8]">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-3 divide-x divide-[#E2DDD8]">
          {[
            { value: '200+', label: 'Products' },
            { value: '12k+', label: 'Customers' },
            { value: '4.8★', label: 'Avg. Rating' },
          ].map(s => (
            <div
              key={s.label}
              className="py-7 text-center transition-colors duration-200 hover:bg-[#FAFAF8] cursor-default"
            >
              <p className="font-serif text-[32px] leading-none text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#C8A97E]">
                {s.value}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-widest text-[#9A8C7E] mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New products */}
      <section className="max-w-5xl mx-auto px-8 py-14">
        <div className="flex items-baseline justify-between border-b border-[#E2DDD8] pb-4 mb-8">
          <h2 className="font-serif text-[28px] text-[#1A1A1A]">New arrivals</h2>
          {/* Link with animated underline */}
          <Link
            to="/shop"
            className="text-[13px] font-medium text-[#9A8C7E] hover:text-[#1A1A1A] transition-colors duration-200
                     relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#1A1A1A]
                     after:transition-all after:duration-300 hover:after:w-full"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newProducts.map(p => (
            <div
              key={p._id}
              className="group bg-white border border-[#E2DDD8] rounded-[10px] overflow-hidden
                       transition-all duration-300
                       hover:border-[#C5BFB8] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
            >
              {/* Image area */}
              <div className="aspect-square bg-[#F0ECE7] relative overflow-hidden">
                <img
                  src={p.coverImage}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* "New" badge fades in more solidly on hover */}
                <span className="absolute top-2.5 left-2.5 bg-[#1A1A1A] text-[#FAFAF8] text-[10px]
                               font-semibold uppercase tracking-wider px-2 py-1 rounded
                               transition-opacity duration-200 opacity-80 group-hover:opacity-100">
                  New
                </span>
                {/* Quick-add button slides up from bottom on hover */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0
                              transition-transform duration-300 ease-out">
                  <button className="w-full bg-[#1A1A1A] text-[#FAFAF8] py-3 text-[12px] font-medium
                                   uppercase tracking-widest hover:bg-[#333] transition-colors duration-150">
                    Quick add
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="px-4 pt-3.5 pb-4">
                <p className="text-[13px] font-medium text-[#1A1A1A] truncate
                            transition-colors duration-200 group-hover:text-[#C8A97E]">
                  {p.name}
                </p>
                <p className="text-[13px] text-[#9A8C7E] mt-1">${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
