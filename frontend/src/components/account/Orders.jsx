import { useState, useEffect } from 'react'
import { ArrowLeft, Package, MapPin, X, ChevronRight, Clock, ShoppingBag, Truck, Home, CheckCircle, RefreshCw } from 'lucide-react'
import { getMyOrders, cancelOrder } from "../../services/orderServices"

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  Pending:            { bg: '#FFF3E0', text: '#E65100', dot: '#FB8C00', border: '#FFB74D' },
  Processing:         { bg: '#E3F2FD', text: '#0D47A1', dot: '#1E88E5', border: '#64B5F6' },
  Shipped:            { bg: '#E8EAF6', text: '#283593', dot: '#3949AB', border: '#7986CB' },
  'Out for Delivery': { bg: '#F3E5F5', text: '#4A148C', dot: '#8E24AA', border: '#BA68C8' },
  Delivered:          { bg: '#E8F5E9', text: '#1B5E20', dot: '#43A047', border: '#81C784' },
  Cancelled:          { bg: '#FFEBEE', text: '#B71C1C', dot: '#E53935', border: '#EF9A9A' },
}

const PAYMENT = {
  Paid:    { bg: '#E8F5E9', text: '#1B5E20' },
  Pending: { bg: '#FFF3E0', text: '#E65100' },
  Failed:  { bg: '#FFEBEE', text: '#B71C1C' },
}

// The 5 steps in the order journey
const STEPS = [
  { label: 'Order Placed',     icon: ShoppingBag },
  { label: 'Processing',       icon: Package },
  { label: 'Shipped',          icon: Truck },
  { label: 'Out for Delivery', icon: Truck },
  { label: 'Delivered',        icon: Home },
]

// ─── Helper functions ─────────────────────────────────────────────────────────
const fmt = iso => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const shortId = id => '#' + id.slice(-8).toUpperCase()

// ─── StatusBadge ─────────────────────────────────────────────────────────────
// Note: STATUS colors are dynamic per-status, so they stay as inline styles
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.Pending
  return (
    <span
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold"
    >
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full" />
      {status}
    </span>
  )
}

// ─── OrderTimeline ────────────────────────────────────────────────────────────
function OrderTimeline({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-[#FFEBEE] border border-[#EF9A9A]">
        <X className="w-5 h-5 flex-shrink-0 text-[#B71C1C]" />
        <div>
          <p className="font-semibold text-sm text-[#B71C1C]">Order Cancelled</p>
          <p className="text-xs mt-0.5 text-[#C62828]">This order has been cancelled.</p>
        </div>
      </div>
    )
  }

  const statusToStep = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    'Out for Delivery': 3,
    Delivered: 4,
  }
  const currentStep = statusToStep[status] ?? 0

  return (
    <div className="relative">
      {/* Connecting line behind the dots */}
      <div
        className="absolute top-5 left-0 right-0 h-0.5 bg-[#E0E0E0]"
        style={{ margin: '0 10%' }}
      />
      {/* Filled portion of the line */}
      <div
        className="absolute top-5 left-0 h-0.5 bg-[#2874F0] transition-all duration-700"
        style={{
          marginLeft: '10%',
          width: `${(currentStep / (STEPS.length - 1)) * 80}%`,
        }}
      />

      {/* Step dots and labels */}
      <div className="relative flex justify-between">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          const isDone = i < currentStep
          const isCurrent = i === currentStep
          return (
            <div key={step.label} className="flex flex-col items-center gap-2 flex-1">
              {/* Circle icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300"
                style={{
                  background: isDone ? '#2874F0' : '#fff',
                  border: isCurrent ? '2px solid #2874F0' : isDone ? 'none' : '2px solid #E0E0E0',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(40,116,240,0.15)' : 'none',
                }}
              >
                {isDone
                  ? <CheckCircle className="w-5 h-5 text-white" />
                  : <Icon className="w-4 h-4" style={{ color: isCurrent ? '#2874F0' : '#BDBDBD' }} />
                }
              </div>
              {/* Step label */}
              <p
                className="text-xs text-center leading-tight font-medium"
                style={{ color: i <= currentStep ? '#212121' : '#9E9E9E', maxWidth: 72 }}
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── OrderDetail ──────────────────────────────────────────────────────────────
function OrderDetail({ order, onBack, onCancel }) {
  const { shippingAddress: a, items, orderStatus, paymentStatus, totalAmount, createdAt, _id } = order
  const canCancel = ['Pending', 'Processing'].includes(orderStatus)

  return (
    <div className="bg-[#F1F3F6] min-h-screen rounded-2xl p-4">

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-sm font-medium text-[#2874F0]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Orders
      </button>

      {/* Order ID + date header */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs font-medium text-[#878787]">ORDER ID</p>
            <p className="font-bold text-base mt-0.5 text-[#212121]">{shortId(_id)}</p>
            <p className="text-xs mt-1 flex items-center gap-1 text-[#878787]">
              <Clock className="w-3.5 h-3.5" />
              Placed on {fmt(createdAt)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={orderStatus} />
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded"
              style={{ background: PAYMENT[paymentStatus]?.bg, color: PAYMENT[paymentStatus]?.text }}
            >
              Payment: {paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Order tracking timeline */}
      <div className="bg-white rounded-lg p-5 mb-3 shadow-sm">
        <p className="text-sm font-bold mb-5 text-[#212121]">Track Order</p>
        <OrderTimeline status={orderStatus} />
      </div>

      {/* Items list */}
      <div className="bg-white rounded-lg mb-3 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-[#F0F0F0]">
          <p className="text-sm font-bold text-[#212121]">
            Items in this order ({items.length})
          </p>
        </div>
        {items.map(item => (
          <div
            key={item._id}
            className="flex items-center gap-3 px-4 py-4 border-b last:border-none border-[#F0F0F0]"
          >
            {/* Product thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#F1F3F6] border border-[#E0E0E0]">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            {/* Name + qty */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-[#212121]">{item.name}</p>
              <p className="text-xs mt-0.5 text-[#878787]">Qty: {item.quantity}</p>
              <p className="text-xs mt-0.5 text-[#878787]">₹{item.price.toFixed(2)} each</p>
            </div>
            {/* Item total */}
            <p className="text-sm font-bold flex-shrink-0 text-[#212121]">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        {/* Order total row */}
        <div className="px-4 py-3 flex items-center justify-between bg-[#F9F9F9] border-t border-[#E0E0E0]">
          <p className="text-sm font-semibold text-[#212121]">Order Total</p>
          <p className="text-lg font-bold text-[#212121]">₹{totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#2874F0]" />
          <p className="text-sm font-bold text-[#212121]">Delivery Address</p>
        </div>
        <p className="text-sm font-semibold text-[#212121]">{a.fullName}</p>
        <p className="text-sm mt-1 leading-relaxed text-[#4A4A4A]">
          {[a.addressLine1, a.addressLine2, a.city, a.state, a.pincode, a.country]
            .filter(Boolean)
            .join(', ')}
        </p>
        <p className="text-sm mt-1 text-[#878787]">📞 {a.phone}</p>
      </div>

      {/* Cancel order section */}
      {canCancel && (
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#212121]">Cancel Order</p>
            <p className="text-xs mt-0.5 text-[#878787]">
              You can cancel before it's shipped.
            </p>
          </div>
          <button
            onClick={() => onCancel(_id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold transition-all duration-150 active:scale-95 bg-[#FFEBEE] text-[#B71C1C] border border-[#EF9A9A]"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Orders (main list view) ──────────────────────────────────────────────────
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
    return <OrderDetail order={selected} onBack={() => setSelected(null)} onCancel={handleCancel} />
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
                  <p className="text-[#565959]">ORDER # {shortId(order._id)}</p>
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
                  <img
                    src={firstItem.image}
                    alt={firstItem.name}
                    className="w-16 h-16 object-contain flex-shrink-0"
                  />
                  <p className="text-sm leading-snug text-[#007185]">
                    {firstItem.name}
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