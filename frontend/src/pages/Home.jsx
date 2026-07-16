import { Link } from 'react-router-dom'
import { getNewProducts, getBestDeals } from '../services/productService'
import { useState, useEffect } from 'react'
import ProductsDisplayCard from '../components/Home/ProductsDisplayCard'
import BodySection from '../components/Home/BodySection'
import HeroSection from '../components/Home/HeroSection'
import { ArrowRight } from 'lucide-react'
import CategorySection from '../components/Home/CategorySection'
import { getCategories } from '../services/categoryServices'


function StarRating({ rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.round(rating) ? 'text-emerald-500' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Home() {
  const [newProducts, setNewProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [bestDeals, setBestDeals] = useState([])

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchCategories();
  }, [])


  const fetchNewProducts = async () => {
    try {
      const res = await getNewProducts()
      setNewProducts(res.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchNewProducts()
  }, [])


  const fetchBestDeals = async () => {
    try {
      const res = await getBestDeals();
      setBestDeals(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    fetchBestDeals();
  },[])
  
  return (
    <>
      <main className="bg-white font-sans text-slate-900 antialiased">
        <HeroSection/>
        <CategorySection categories={categories} />
        <BodySection />
        <ProductsDisplayCard products={newProducts} title ="Latest Products" eyebrow='New Arrivals' />
        <ProductsDisplayCard products={bestDeals} title="Best Deals" eyebrow="Best Discount" />
      </main>
    </>
  )
}