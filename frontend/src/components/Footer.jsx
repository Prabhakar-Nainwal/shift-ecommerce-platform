import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-gray-900 mb-2">Lumé</h3>
          <p className="text-sm text-gray-500">Curated everyday objects, thoughtfully designed for modern living.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/"        className="hover:text-gray-800 transition-colors">Home</Link></li>
            <li><Link to="/shop"    className="hover:text-gray-800 transition-colors">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-gray-800 transition-colors">Contact</Link></li>
            <li><Link to="/cart"    className="hover:text-gray-800 transition-colors">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">Contact</h4>
          <ul className="space-y-1 text-sm text-gray-500">
            <li>hello@lume.store</li>
            <li>+1 (555) 012-3456</li>
            <li>Mon–Fri, 9am–6pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Lumé. All rights reserved.
      </div>
    </footer>
  )
}
