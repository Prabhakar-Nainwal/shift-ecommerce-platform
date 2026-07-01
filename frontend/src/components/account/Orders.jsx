import { useState, useEffect } from 'react'
import { Package, RefreshCw } from 'lucide-react'
import { getMyOrders, cancelOrder } from "../../services/orderServices"
import OrderDetails from './OrderDetails'

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
  const [page, setPage] = useState(1)
  
  const currentYear = new Date().getFullYear()
  const [filter, setFilter] = useState(currentYear)
  // State to hold the real year list returned by the backend
  const [availableYears, setAvailableYears] = useState([currentYear])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // Passing both page and the selected year filter to the backend
      const res = await getMyOrders(page, filter)
      
      // Backend now returns { data: [...], availableYears: [...] }
      setOrders(res.data.data)
      if (res.data.availableYears) {
        setAvailableYears(res.data.availableYears)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // Refetches strictly when page OR selected year changes
  useEffect(() => {
    fetchOrders()
  }, [page, filter])

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id)
      const res = await getMyOrders(page, filter)
      setOrders(res.data.data)
      if (selected) {
        const updated = res.data.data.find(order => order._id === id)
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

  // ── Empty state (Shows when a specific year has no entries) ──
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        {/* Render control header even when empty so user can switch years back */}
        <div className="w-full max-w-xl mb-4">
          <YearFilterHeader 
            page={page} 
            setPage={setPage} 
            filter={filter} 
            setFilter={setFilter} 
            availableYears={availableYears} 
          />
        </div>
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#E3F2FD]">
          <Package className="w-10 h-10 text-[#2874F0]" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#212121]">No orders in {filter}!</p>
          <p className="text-sm mt-1 text-[#878787]">
            Try choosing a different year from the filter options above.
          </p>
        </div>
      </div>
    )
  }

  // ── Orders list ──
  return (
    <div>
      <YearFilterHeader 
        page={page} 
        setPage={setPage} 
        filter={filter} 
        setFilter={setFilter} 
        availableYears={availableYears} 
      />

      <div className="space-y-3">
        {orders.map(order => {
          const firstItem = order.items[0]
          const extraCount = order.items.length - 1

          return (
            <div key={order._id} className="bg-white rounded-lg overflow-hidden border border-[#D5D9D9]">
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
                <p className="text-base font-bold mb-0.5" style={{ color: STATUS[order.orderStatus]?.text || '#212121' }}>
                  {order.orderStatus}
                </p>
                <div className="flex items-start gap-4 mt-3">
                  {firstItem?.image && (
                    <img src={firstItem.image} alt={firstItem.name} className="w-16 h-16 object-contain flex-shrink-0" />
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

// Extracted Subcomponent for cleaner layout representation
function YearFilterHeader({ page, setPage, filter, setFilter, availableYears }) {
  return (
    <div className='flex items-center justify-between p-4 bg-white border border-[#D5D9D9] rounded-t-lg mb-3'>
      <div className='flex items-center gap-3 font-semibold text-sm text-[#565959]'>
        <button 
          className="px-2 py-1 border border-[#D5D9D9] rounded bg-[#F0F2F2] hover:bg-gray-200 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        >
          &lt; Prev
        </button>
        <p className="text-[#212121]">Page {page}</p>
        <button 
          className="px-2 py-1 border border-[#D5D9D9] rounded bg-[#F0F2F2] hover:bg-gray-200"
          onClick={() => setPage(prev => prev + 1)}
        >
          Next &gt;
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="year-filter" className="text-xs font-semibold text-[#565959]">FILTER BY YEAR:</label>
        <select
          id="year-filter"
          value={filter}
          onChange={(e) => {
            setFilter(Number(e.target.value))
            setPage(1) // Always reset to page 1 when switching years
          }}
          className="text-xs font-medium border border-[#D5D9D9] bg-[#F0F2F2] text-[#212121] py-1 px-3 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#2874F0] cursor-pointer"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}