import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Box, Users, BarChart2,
  Tag, Truck, Settings, Plus, Search, Bell, Download,
  ArrowRight, TrendingUp, TrendingDown
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const navSections = [
  {
    label: 'Main',
    items: [
      { id: 'overview',   icon: LayoutDashboard, label: 'Overview' },
      { id: 'orders',     icon: ShoppingBag,     label: 'Orders' },
      { id: 'products',   icon: Box,             label: 'Products' },
      { id: 'customers',  icon: Users,           label: 'Customers' },
    ]
  },
  {
    label: 'Store',
    items: [
      { id: 'analytics',  icon: BarChart2,       label: 'Analytics' },
      { id: 'discounts',  icon: Tag,             label: 'Discounts' },
      { id: 'shipping',   icon: Truck,           label: 'Shipping' },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'settings',   icon: Settings,        label: 'Settings' },
    ]
  }
]

const stats = [
  { label: 'Revenue',    value: '$24,310', change: '+12.4%', up: true,  color: '#C8A97E' },
  { label: 'Orders',     value: '1,084',   change: '+8.1%',  up: true,  color: '#185FA5' },
  { label: 'Customers',  value: '12,430',  change: '+3.7%',  up: true,  color: '#0F6E56' },
  { label: 'Avg. order', value: '$22.43',  change: '−2.1%',  up: false, color: '#854F0B' },
]

const revenueData = [
  { month: 'Dec', current: 14200, prev: 12800 },
  { month: 'Jan', current: 18400, prev: 15900 },
  { month: 'Feb', current: 16100, prev: 14200 },
  { month: 'Mar', current: 21300, prev: 18700 },
  { month: 'Apr', current: 19800, prev: 17400 },
  { month: 'May', current: 23100, prev: 20500 },
  { month: 'Jun', current: 24310, prev: 21900 },
]

const categories = [
  { name: 'Home & Living', pct: 38, color: '#C8A97E' },
  { name: 'Ceramics',      pct: 24, color: '#378ADD' },
  { name: 'Stationery',    pct: 19, color: '#1D9E75' },
  { name: 'Lighting',      pct: 12, color: '#D85A30' },
  { name: 'Other',         pct: 7,  color: '#888780' },
]

const recentOrders = [
  { id: '#4821', name: 'Priya Sharma',  amt: '$64.00',  status: 'Shipped',    statusStyle: 'bg-[#EAF3DE] text-[#3B6D11]' },
  { id: '#4820', name: 'Rohan Mehta',   amt: '$32.00',  status: 'Pending',    statusStyle: 'bg-[#FAEEDA] text-[#854F0B]' },
  { id: '#4819', name: 'Ananya Iyer',   amt: '$115.50', status: 'Shipped',    statusStyle: 'bg-[#EAF3DE] text-[#3B6D11]' },
  { id: '#4818', name: 'Dev Kapoor',    amt: '$48.00',  status: 'Cancelled',  statusStyle: 'bg-[#FCEBEB] text-[#A32D2D]' },
  { id: '#4817', name: 'Meera Pillai',  amt: '$27.00',  status: 'Processing', statusStyle: 'bg-[#E6F1FB] text-[#185FA5]' },
]

const lowStock = [
  { name: 'Ceramic Planter',   cat: 'Home & Living', stock: 3,  low: true  },
  { name: 'Soy Pillar Candle', cat: 'Lighting',      stock: 5,  low: true  },
  { name: 'Matte Pour Mug',    cat: 'Ceramics',      stock: 14, low: false },
  { name: 'Oak Letter Tray',   cat: 'Stationery',    stock: 2,  low: true  },
  { name: 'Linen Hand Cream',  cat: 'Home & Living', stock: 22, low: false },
]

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('overview')

  return (
    <div className="flex min-h-screen bg-[#FAFAF8]">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] flex-shrink-0 bg-[#1A1A1A] flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-6 border-b border-[#2E2E2E]">
          <span className="font-serif text-[20px] text-[#FAFAF8]">UrbanShop</span>
          <span className="block text-[10px] tracking-[.12em] uppercase text-[#9A8C7E] mt-0.5">
            Admin panel
          </span>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-5 pt-5 pb-2 text-[10px] tracking-[.12em] uppercase text-[#444] font-medium">
                {section.label}
              </p>
              {section.items.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  className={`w-full flex items-center gap-2.5 mx-2 px-3 py-2.5 rounded-lg
                              text-[13px] font-medium text-left transition-all duration-150
                              ${activeNav === id
                                ? 'bg-[#C8A97E] text-[#1A1A1A]'
                                : 'text-[#9A8C7E] hover:bg-[#2A2A2A] hover:text-[#FAFAF8]'
                              }`}
                  style={{ width: 'calc(100% - 16px)' }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-[#2E2E2E] p-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                          transition-colors duration-150 hover:bg-[#2A2A2A]">
            <div className="w-8 h-8 rounded-full bg-[#C8A97E] flex items-center justify-center
                            text-[12px] font-semibold text-[#1A1A1A] flex-shrink-0">
              AS
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#FAFAF8]">Admin Singh</p>
              <p className="text-[11px] text-[#555]">Super admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 p-8 overflow-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-[32px] leading-none text-[#1A1A1A]">Overview</h1>
            <p className="text-[12px] text-[#9A8C7E] mt-1">Thursday, 26 June 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg border border-[#E2DDD8] bg-white flex items-center
                               justify-center text-[#9A8C7E] transition-all duration-150
                               hover:border-[#C5BFB8] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                               hover:-translate-y-0.5">
              <Search size={15} />
            </button>
            <button className="relative w-9 h-9 rounded-lg border border-[#E2DDD8] bg-white
                               flex items-center justify-center text-[#9A8C7E]
                               transition-all duration-150
                               hover:border-[#C5BFB8] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                               hover:-translate-y-0.5">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E24B4A]
                               border border-white" />
            </button>
            <button className="h-9 px-4 rounded-lg bg-[#1A1A1A] text-[#FAFAF8] text-[12px]
                               font-semibold uppercase tracking-wider flex items-center gap-1.5
                               transition-all duration-200
                               hover:bg-[#333] hover:-translate-y-0.5 hover:shadow-md
                               active:translate-y-0">
              <Plus size={14} /> New product
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {stats.map(s => (
            <div key={s.label}
              className="group bg-white border border-[#E2DDD8] rounded-xl p-4
                         transition-all duration-200 cursor-default
                         hover:border-[#C5BFB8] hover:-translate-y-0.5
                         hover:shadow-[0_6px_20px_rgba(0,0,0,.06)]">
              <p className="text-[11px] uppercase tracking-[.1em] text-[#9A8C7E] font-medium mb-2.5">
                {s.label}
              </p>
              <p className="font-serif text-[28px] leading-none text-[#1A1A1A]">{s.value}</p>
              <p className={`text-[11px] mt-1.5 flex items-center gap-1 font-medium
                             ${s.up ? 'text-[#3B6D11]' : 'text-[#A32D2D]'}`}>
                {s.up
                  ? <TrendingUp size={12} />
                  : <TrendingDown size={12} />
                }
                {s.change} vs last month
              </p>
            </div>
          ))}
        </div>

        {/* Revenue + Categories */}
        <div className="grid grid-cols-[1fr_300px] gap-4 mb-4">

          {/* Revenue chart */}
          <div className="bg-white border border-[#E2DDD8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#E2DDD8]">
              <h2 className="font-serif text-[17px] text-[#1A1A1A]">Revenue — last 7 months</h2>
              <button className="flex items-center gap-1 text-[12px] text-[#9A8C7E] font-medium
                                 transition-colors duration-150 hover:text-[#1A1A1A]">
                Export <Download size={12} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueData} barGap={2}>
                <CartesianGrid vertical={false} stroke="#F0ECE7" />
                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#9A8C7E' }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#9A8C7E' }}
                  tickFormatter={v => '$' + (v/1000).toFixed(0) + 'k'} />
                <Tooltip
                  formatter={v => ['$' + v.toLocaleString()]}
                  contentStyle={{ border: '0.5px solid #E2DDD8', borderRadius: 8,
                                  fontSize: 12, color: '#1A1A1A' }}
                />
                <Bar dataKey="prev"    fill="#E2DDD8" radius={[4,4,0,0]} />
                <Bar dataKey="current" fill="#C8A97E" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-[11px] text-[#9A8C7E]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C8A97E] inline-block" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E2DDD8] inline-block" />
                Previous period
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border border-[#E2DDD8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#E2DDD8]">
              <h2 className="font-serif text-[17px] text-[#1A1A1A]">Top categories</h2>
              <button className="flex items-center gap-1 text-[12px] text-[#9A8C7E] font-medium
                                 transition-colors duration-150 hover:text-[#1A1A1A]">
                Details <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-4">
              {categories.map(c => (
                <div key={c.name}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="font-medium text-[#1A1A1A]">{c.name}</span>
                    <span className="text-[#9A8C7E]">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#F0ECE7] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${c.pct}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders + Low stock */}
        <div className="grid grid-cols-2 gap-4">

          {/* Recent orders */}
          <div className="bg-white border border-[#E2DDD8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#E2DDD8]">
              <h2 className="font-serif text-[17px] text-[#1A1A1A]">Recent orders</h2>
              <button className="flex items-center gap-1 text-[12px] text-[#9A8C7E] font-medium
                                 transition-colors duration-150 hover:text-[#1A1A1A]">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div>
              {recentOrders.map(o => (
                <div key={o.id}
                  className="group flex items-center gap-2.5 py-2.5 border-b border-[#F0ECE7]
                             last:border-none cursor-pointer rounded-lg transition-all duration-150
                             hover:bg-[#FAFAF8] hover:px-2">
                  <span className="text-[12px] font-semibold text-[#1A1A1A] w-14 flex-shrink-0">
                    {o.id}
                  </span>
                  <span className="text-[12px] text-[#1A1A1A] flex-1 truncate">{o.name}</span>
                  <span className="font-serif text-[13px] text-[#1A1A1A] flex-shrink-0">{o.amt}</span>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${o.statusStyle}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low stock */}
          <div className="bg-white border border-[#E2DDD8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#E2DDD8]">
              <h2 className="font-serif text-[17px] text-[#1A1A1A]">Low stock</h2>
              <button className="flex items-center gap-1 text-[12px] text-[#9A8C7E] font-medium
                                 transition-colors duration-150 hover:text-[#1A1A1A]">
                Manage <ArrowRight size={12} />
              </button>
            </div>
            <div>
              {lowStock.map(p => (
                <div key={p.name}
                  className="group flex items-center gap-3 py-2.5 border-b border-[#F0ECE7]
                             last:border-none cursor-pointer rounded-lg transition-all duration-150
                             hover:bg-[#FAFAF8] hover:px-2">
                  <div className="w-9 h-9 rounded-lg bg-[#F0ECE7] flex items-center justify-center
                                  text-lg flex-shrink-0 transition-colors duration-150
                                  group-hover:bg-[#E8E3DD]">
                    {p.name.includes('Planter') ? '🪴'
                      : p.name.includes('Candle') ? '🕯️'
                      : p.name.includes('Mug') ? '☕'
                      : p.name.includes('Tray') ? '📐'
                      : '🧴'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1A1A1A] truncate">{p.name}</p>
                    <p className="text-[11px] text-[#9A8C7E]">{p.cat}</p>
                  </div>
                  <span className={`text-[12px] font-medium flex-shrink-0
                                   ${p.low ? 'text-[#A32D2D]' : 'text-[#3B6D11]'}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}