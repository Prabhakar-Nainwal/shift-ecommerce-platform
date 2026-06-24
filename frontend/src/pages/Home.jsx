import { Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const newProducts = products.filter(p=> p.badge === 'New').sort((a,b)=> b.rating - a.rating).slice(0,4)

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-brand-600 font-medium text-sm mb-3 tracking-wide uppercase">Free shipping on orders over $50</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Objects worth<br />living with.
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              A curated collection of everyday essentials — designed to make your space feel intentional.
            </p>
            <div className="flex gap-3">
              <Link to="/shop" className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                Shop now
              </Link>
              <Link to="/contact" className="border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors">
                Get in touch
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {products.slice(0, 4).map(p => (
              <div key={p.id} className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '200+', label: 'Products' },
            { value: '12k+', label: 'Customers' },
            { value: '4.8★', label: 'Avg. Rating' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Try Our New Products</h2>
          <Link to="/shop" className="text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>


    </main>
  )
}
