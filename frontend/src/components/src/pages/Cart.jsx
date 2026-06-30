import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, ShoppingBag, ArrowRight, Tag, X, Minus, Plus } from 'lucide-react'
import { createOrder } from '../services/orderServices'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'


export default function Cart({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQty, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) return;
      const defaultAddress = user.addresses.find(
        address => address.isDefault
      );

      if (!defaultAddress) {
        alert("Please add a default shipping address.");
        navigate("/account/addresses");
        onClose(); 
        return;
      }
      const order = {
        items: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.coverImage,
          price: item.product.price,
          quantity: item.quantity
        })),
        shippingAddress: defaultAddress,
        totalAmount: total >= 50 ? total : total + 5
      };
      const res = await createOrder(order);
      clearCart();
      navigate("/account/orders");
      onClose(); 
    } catch (err) {
      console.log(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
     
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
       
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out">
       
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-zinc-900" />
              <h2 className="text-base font-bold uppercase tracking-wider text-zinc-900">Your Bag</h2>
              <span className="text-xs font-mono px-2 py-0.5 bg-zinc-100 rounded text-zinc-500">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cartItems.length === 0 ? (
             
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="p-4 bg-zinc-50 rounded-full mb-3">
                  <ShoppingBag className="w-6 h-6 text-zinc-300" />
                </div>
                <p className="text-sm font-semibold text-zinc-800">Your bag is empty</p>
                <p className="text-xs text-zinc-400 max-w-[200px] mt-1 mb-6">Looks like you haven't added anything yet.</p>
                <Link 
                  to="/shop" 
                  onClick={onClose}
                  className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                >
                  Shop Best Sellers
                </Link>
              </div>
            ) : (
              
              cartItems.map(item => (
                <div 
                  key={item.product._id} 
                  className="flex gap-4 items-center py-3 border-b border-zinc-100 last:border-0 group"
                >
               
                  <div className="w-16 h-20 bg-zinc-50 border border-zinc-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.coverImage} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                      {item.product.category}
                    </span>
                    <h3 className="text-xs font-bold text-zinc-900 truncate">
                      {item.product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center border border-zinc-200 rounded bg-zinc-50">
                        <button 
                          onClick={() => updateQty(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 text-zinc-500 hover:bg-zinc-100 flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQty(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 text-zinc-500 hover:bg-zinc-100 flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end justify-between h-20 py-1">
                    <span className="text-xs font-bold text-zinc-900">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.product._id)}
                      className="p-1 text-zinc-300 hover:text-red-600 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

  
          {cartItems.length > 0 && (
            <div className="border-t border-zinc-100 bg-zinc-50/50 p-6 space-y-4">
              
  
              {total < 999 && (
                <div className="flex gap-2 items-start bg-white border border-zinc-200 p-3 rounded text-xs text-zinc-600">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <p>
                    Add <span className="font-bold text-zinc-900">₹{(999 - total).toFixed(0)}</span> more to your cart to instantly receive <span className="font-semibold text-zinc-900">Free Shipping</span>.
                  </p>
                </div>
              )}

           
              <div className="space-y-1.5 text-xs font-mono text-zinc-500">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span className="font-bold text-zinc-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING FEE:</span>
                  <span>{total >= 999 ? "FREE" : "₹5.00"}</span>
                </div>
                <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-sans font-bold text-zinc-900">
                  <span>Estimated Total:</span>
                  <span className="text-lg font-black">₹{(total >= 999 ? total : total + 5).toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-zinc-900 text-white py-3 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-center text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}