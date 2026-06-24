import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, total } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl bg-gray-50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{item.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors">−</button>
                    <span className="px-3 py-1 text-sm font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors">+</button>
                  </div>
                  <span className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{total >= 50 ? <span className="text-green-600">Free</span> : '$5.00'}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 mb-5">
              <span>Total</span>
              <span>${(total >= 50 ? total : total + 5).toFixed(2)}</span>
            </div>
            <button className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-medium transition-colors">
              Checkout
            </button>
            <Link to="/shop" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)
