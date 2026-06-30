import { useState, useEffect } from 'react'
import { Package, RefreshCw } from 'lucide-react'
import { getMyOrders, cancelOrder } from "../../services/orderServices"
import OrderDetails from './OrderDetails' // Imported the split view component

// Status configuration needed for list view colors
const STATUS = {
  Pending:            { text: '#E65100' },
  Processing:         { text: '#0D47A1' },
  Shipped:            { text: '#283593' },
  'Out for Delivery': { text: '#4A148C' },
  Delivered:          { text: '#1B5E20' },
  Cancelled:          { text: '#B71C1C' },
}

const fmt = iso => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders()
      setOrders(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id)
      const res = await getMyOrders()
      setOrders(res.data)
      if (selected) {
        const updated = res.data.find(order => order._id === id)
        setSelected(updated)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-[#2874F0]" />
        <p className="text-sm text-[#878787]">Loading your orders...</p>
      </div>
    )
  }

  // ── Detail view ──
  if (selected) {
    return (
      <OrderDetails 
        order={selected} 
        onBack={() => setSelected(null)} 
        onCancel={handleCancel} 
      />
    )
  }

  // ── Empty state ──
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#E3F2FD]">
          <Package className="w-10 h-10 text-[#2874F0]" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#212121]">No orders yet!</p>
          <p className="text-sm mt-1 text-[#878787]">
            Your orders will show up here after you place them.
          </p>
        </div>
      </div>
    )
  }

  // ── Orders list ──
  return (
    <div>
      <div className="space-y-3">
        {orders.map(order => {
          const firstItem = order.items[0]
          const extraCount = order.items.length - 1

          return (
            <div
              key={order._id}
              className="bg-white rounded-lg overflow-hidden border border-[#D5D9D9]"
            >
              {/* Grey header */}
              <div className="flex flex-wrap items-start gap-x-8 gap-y-1 px-4 py-3 text-xs bg-[#F0F2F2] border-b border-[#D5D9D9]">
                <div>
                  <p className="text-[#565959]">ORDER PLACED</p>
                  <p className="font-semibold mt-0.5 text-[#212121]">{fmt(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[#565959]">TOTAL</p>
                  <p className="font-semibold mt-0.5 text-[#212121]">₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[#565959]"> {order.orderId}</p>
                  <button
                    onClick={() => setSelected(order)}
                    className="mt-0.5 font-semibold hover:underline text-[#007185]"
                  >
                    View order details
                  </button>
                </div>
              </div>

              {/* Body: status line + product row */}
              <div className="px-4 py-4">
                <p
                  className="text-base font-bold mb-0.5"
                  style={{ color: STATUS[order.orderStatus]?.text || '#212121' }}
                >
                  {order.orderStatus}
                </p>

                <div className="flex items-start gap-4 mt-3">
                  {firstItem?.image && (
                    <img
                      src={firstItem.image}
                      alt={firstItem.name}
                      className="w-16 h-16 object-contain flex-shrink-0"
                    />
                  )}
                  <p className="text-sm leading-snug text-[#007185]">
                    {firstItem?.name}
                    {extraCount > 0 && <span className="text-[#565959]"> +{extraCount} more items</span>}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}