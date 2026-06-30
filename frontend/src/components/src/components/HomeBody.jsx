import { useState } from 'react'
import { Link } from 'react-router-dom'

const BRANDS = [
  { name: 'Sony', emoji: '🎵' },
  { name: 'Apple', emoji: '🍎' },
  { name: 'Samsung', emoji: '📱' },
  { name: 'Bose', emoji: '🔊' },
  { name: 'Logitech', emoji: '🖱️' },
  { name: 'Canon', emoji: '📷' },
  { name: 'Dell', emoji: '🖥️' },
  { name: 'JBL', emoji: '🎧' },
]

const REVIEWS = [
  {
    id: 1,
    name: 'Arjun M.',
    location: 'Mumbai',
    rating: 5,
    text: 'Delivered in 36 hours. The packaging was immaculate and the headphones were exactly as described. Will definitely order again.',
    product: 'Sony WH-1000XM5',
    initials: 'AM',
    color: '#e0e7ff',
    textColor: '#4338ca',
  },
  {
    id: 2,
    name: 'Priya S.',
    location: 'Bengaluru',
    rating: 5,
    text: 'Returns were hassle-free. Got a full refund within 3 days. Rare to find this level of service in India.',
    product: 'Logitech MX Keys',
    initials: 'PS',
    color: '#d1fae5',
    textColor: '#065f46',
  },
  {
    id: 3,
    name: 'Rahul K.',
    location: 'Delhi',
    rating: 4,
    text: 'Great prices and genuine products. The live chat support helped me pick the right monitor for video editing.',
    product: 'Dell UltraSharp 27"',
    initials: 'RK',
    color: '#fef3c7',
    textColor: '#92400e',
  },
]

const WHY_US = [
  {
    icon: '⚡',
    title: 'Same-day dispatch',
    desc: 'Order before 2 PM and your item ships today — tracked from warehouse to doorstep.',
  },
  {
    icon: '🛡️',
    title: 'Verified genuine products',
    desc: 'Every item is sourced directly from authorized distributors. No grey market, ever.',
  },
  {
    icon: '↩️',
    title: '60-day hassle-free returns',
    desc: 'Changed your mind? Return anything within 60 days for a full refund, no questions asked.',
  },
]

function Stars({ rating }) {
  return (
    <span style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13" height="13"
          viewBox="0 0 20 20"
          fill={i < rating ? '#f59e0b' : '#e2e8f0'}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

export default function HomeBody() {
  const [activeBrand, setActiveBrand] = useState(null)

  return (
    <div style={{ background: '#f8fafc', fontFamily: 'sans-serif', color: '#0f172a' }}>
      
    </div>
  )
}