import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
export default function Cart() {
  
  const { cartItems, removeFromCart, updateQty, total } = useCart()

  return (
    <main className="max-w-5xl mx-auto px-8 py-14">

      {/* Page header */}
      <div className="border-b border-[#E2DDD8] pb-6 mb-10">
        <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9A8C7E] mb-3
                    flex items-center gap-3 before:block before:w-6 before:h-px before:bg-[#9A8C7E]">
          Review & checkout
        </p>
        <h1 className="font-serif text-[42px] leading-none text-[#1A1A1A]">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (

        /* Empty state */
        <div className="text-center py-24 border border-dashed border-[#E2DDD8] rounded-xl">
          <div className="w-14 h-14 rounded-full bg-[#F0ECE7] flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-6 h-6 text-[#9A8C7E]" />
          </div>
          <p className="font-serif text-[26px] text-[#1A1A1A] mb-2">Nothing here yet.</p>
          <p className="text-[14px] text-[#9A8C7E] mb-8">Add some products to get started.</p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-[13px] font-medium text-[#9A8C7E]
                     transition-colors duration-200 hover:text-[#1A1A1A]"
          >
            Browse the shop
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

      ) : (

        <div className="grid lg:grid-cols-3 gap-10 items-start">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="group flex gap-4 bg-white border border-[#E2DDD8] rounded-xl p-4
                         transition-all duration-200
                         hover:border-[#C5BFB8] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F0ECE7] flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-[#C5BFB8] mb-0.5">
                    {item.category}
                  </p>
                  <h3 className="text-[14px] font-medium text-[#1A1A1A] truncate
                               transition-colors duration-200 group-hover:text-[#C8A97E]">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-[#E2DDD8] rounded-md overflow-hidden
                                  transition-colors duration-200 hover:border-[#C5BFB8]">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#9A8C7E] text-lg
                                 transition-all duration-150 hover:bg-[#F0ECE7] hover:text-[#1A1A1A]
                                 active:scale-90"
                      >
                        −
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-[13px] font-medium
                                     text-[#1A1A1A] border-x border-[#E2DDD8]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#9A8C7E] text-lg
                                 transition-all duration-150 hover:bg-[#F0ECE7] hover:text-[#1A1A1A]
                                 active:scale-90"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif text-[17px] text-[#1A1A1A]">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex-shrink-0 self-start mt-1 p-1.5 rounded-md text-[#C5BFB8]
                           transition-all duration-200
                           hover:text-[#791F1F] hover:bg-[#F7C1C1]/40
                           active:scale-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="sticky top-24">
            <div className="bg-white border border-[#E2DDD8] rounded-xl p-6
                          shadow-[0_4px_24px_rgba(0,0,0,0.05)]">

              <h2 className="font-serif text-[22px] text-[#1A1A1A] border-b border-[#E2DDD8] pb-4 mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#9A8C7E]">Subtotal</span>
                  <span className="text-[#1A1A1A] font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#9A8C7E]">Shipping</span>
                  {total >= 50
                    ? <span className="text-[#3B6D11] font-medium">Free</span>
                    : <span className="text-[#1A1A1A] font-medium">$5.00</span>
                  }
                </div>
                {total < 50 && (
                  <div className="flex items-start gap-2 bg-[#F0ECE7] rounded-md px-3 py-2.5 mt-1">
                    <Tag className="w-3.5 h-3.5 text-[#9A8C7E] mt-0.5 flex-shrink-0" />
                    <p className="text-[12px] text-[#6B6358] leading-snug">
                      Add <span className="font-semibold text-[#1A1A1A]">${(50 - total).toFixed(2)}</span> more for free shipping.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#E2DDD8] pt-4 flex justify-between mb-6">
                <span className="font-medium text-[#1A1A1A] text-[14px]">Total</span>
                <span className="font-serif text-[22px] text-[#1A1A1A]">
                  ${(total >= 50 ? total : total + 5).toFixed(2)}
                </span>
              </div>

              <button
                className="group w-full bg-[#1A1A1A] text-[#FAFAF8] py-3 rounded-md
                         text-[12px] font-semibold uppercase tracking-widest
                         flex items-center justify-center gap-2
                         transition-all duration-200
                         hover:bg-[#333] hover:-translate-y-0.5 hover:shadow-md
                         active:translate-y-0 active:shadow-none"
              >
                Checkout
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <Link
                to="/shop"
                className="group mt-4 flex items-center justify-center gap-1.5
                         text-[12px] font-medium text-[#9A8C7E] uppercase tracking-wider
                         transition-colors duration-200 hover:text-[#1A1A1A]"
              >
                Continue shopping
                <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

        </div>
      )}
    </main>
  )
}

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)
