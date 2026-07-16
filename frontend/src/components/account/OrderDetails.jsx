import { useState } from 'react'
import { ArrowLeft, MapPin, X, Clock, Package, Truck, Home, CheckCircle, ShoppingBag, CreditCard, Loader2 } from 'lucide-react'
import { createPaymentSession } from '../../services/paymentServices'

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  Pending:            { bg: '#FFF3E0', text: '#E65100', dot: '#FB8C00', border: '#FFB74D' },
  Processing:         { bg: '#E3F2FD', text: '#0D47A1', dot: '#1E88E5', border: '#64B5F6' },
  Shipped:            { bg: '#E8EAF6', text: '#283593', dot: '#3949AB', border: '#7986CB' },
  'Out For Delivery': { bg: '#F3E5F5', text: '#4A148C', dot: '#8E24AA', border: '#BA68C8' },
  Delivered:          { bg: '#E8F5E9', text: '#1B5E20', dot: '#43A047', border: '#81C784' },
  Cancelled:          { bg: '#FFEBEE', text: '#B71C1C', dot: '#E53935', border: '#EF9A9A' },
}

const PAYMENT = {
  Paid:     { bg: '#E8F5E9', text: '#1B5E20' },
  Pending:  { bg: '#FFF3E0', text: '#E65100' },
  Failed:   { bg: '#FFEBEE', text: '#B71C1C' },
  Refunded: { bg: '#E3F2FD', text: '#0D47A1' },
}

const STEPS = [
  { label: 'Order Placed',     icon: ShoppingBag },
  { label: 'Processing',       icon: Package },
  { label: 'Shipped',          icon: Truck },
  { label: 'Out For Delivery', icon: Truck },
  { label: 'Delivered',        icon: Home },
]

// ─── Helper functions ─────────────────────────────────────────────────────────
const fmt = iso => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// ─── Sub-Components ───────────────────────────────────────────────────────────
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
    'Out For Delivery': 3,
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
          // ─── FIX HERE ───
          // Change 'i < currentStep' to 'i <= currentStep' if you want the 
          // current stage to also display a checkmark.
          const isDone = i <= currentStep 
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
// ─── Main Export ──────────────────────────────────────────────────────────────
export default function OrderDetails({ order, onBack, onCancel }) {
  const { shippingAddress: a, items, orderStatus, paymentStatus, paymentMethod, refundStatus, totalAmount, createdAt, orderId } = order
  const canCancel = ['Pending', 'Processing'].includes(orderStatus)
  const canRetryPayment = paymentMethod === 'Online' && ['Pending', 'Failed'].includes(paymentStatus) && orderStatus !== 'Cancelled'

  const [payingNow, setPayingNow] = useState(false)
  const [payError, setPayError] = useState('')

  const handlePayNow = async () => {
    try {
      setPayError('')
      setPayingNow(true)
      const res = await createPaymentSession(order._id)
      const { paymentSessionId } = res.data.data

      if (!window.Cashfree) {
        setPayError('Payment SDK failed to load. Please refresh and try again.')
        setPayingNow(false)
        return
      }

      const cashfree = window.Cashfree({ mode: import.meta.env.VITE_CASHFREE_MODE || 'sandbox' })
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_self'
      })
    } catch (err) {
      setPayError(err.response?.data?.message || 'Could not start payment. Please try again.')
      setPayingNow(false)
    }
  }

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
            <p className="font-bold text-base mt-0.5 text-[#212121]">{orderId}</p>
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
            <span className="text-[11px] text-[#878787]">
              {paymentMethod === 'Online' ? 'Paid Online' : 'Cash on Delivery'}
            </span>
            {refundStatus && refundStatus !== 'Not Initiated' && (
              <span className="text-[11px] font-medium text-[#0D47A1]">
                Refund: {refundStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pay Now - shown when an online order still needs to be paid */}
      {canRetryPayment && (
        <div className="bg-white rounded-lg p-4 mb-3 shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#212121]">Complete Your Payment</p>
            <p className="text-xs mt-0.5 text-[#878787]">
              {paymentStatus === 'Failed'
                ? 'Your last payment attempt failed. You can try again.'
                : 'This order is awaiting payment.'}
            </p>
            {payError && <p className="text-xs mt-1 text-[#B71C1C]">{payError}</p>}
          </div>
          <button
            onClick={handlePayNow}
            disabled={payingNow}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold transition-all duration-150 active:scale-95 bg-[#2874F0] text-white disabled:opacity-60"
          >
            {payingNow ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
            {payingNow ? 'Redirecting...' : 'Pay Now'}
          </button>
        </div>
      )}

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
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#F1F3F6] border border-[#E0E0E0]">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-[#212121]">{item.name}</p>
              <p className="text-xs mt-0.5 text-[#878787]">Qty: {item.quantity}</p>
              <p className="text-xs mt-0.5 text-[#878787]">₹{item.price.toFixed(2)} each</p>
            </div>
            <p className="text-sm font-bold flex-shrink-0 text-[#212121]">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
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
            onClick={() => onCancel(order._id)}
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