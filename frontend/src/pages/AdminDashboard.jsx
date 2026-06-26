import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, 
  ShoppingBag, Users, Activity, 
  Search, ArrowUpRight, CheckCircle2, 
  Clock, AlertTriangle, Filter, Download 
} from 'lucide-react';

// Mock Data for Analytics
const KPI_DATA = [
  { title: "Gross Revenue (GMV)", value: "$48,259.00", change: "+12.4%", positive: true, icon: DollarSign, time: "vs last week" },
  { title: "Total Orders", value: "1,240", change: "+8.2%", positive: true, icon: ShoppingBag, time: "vs last week" },
  { title: "Conversion Rate", value: "3.42%", change: "-0.4%", positive: false, icon: Activity, time: "vs last week" },
  { title: "Active Customers", value: "8,942", change: "+18.1%", positive: true, icon: Users, time: "vs yesterday" }
];

const RECENT_ORDERS = [
  { id: "#ORD-9402", customer: "Marcus Vance", product: "Pro Wireless Earbuds", amount: "$129.99", status: "Delivered", date: "Just now" },
  { id: "#ORD-9401", customer: "Helena Smith", product: "Ergonomic Office Chair", amount: "$349.00", status: "Processing", date: "12 mins ago" },
  { id: "#ORD-9400", customer: "Rajesh Kumar", product: "Ultra-wide Gaming Monitor", amount: "$599.99", status: "Processing", date: "45 mins ago" },
  { id: "#ORD-9399", customer: "Sophia Lopez", product: "USB-C Multi-Port Hub", amount: "$45.50", status: "Failed", date: "2 hours ago" },
];

const STOCK_ALERTS = [
  { item: "Mechanical Keyboard (Red Switches)", SKU: "KB-MX-RED", stock: 3, status: "Critical" },
  { item: "Leather Smartphone Case iPhone 15", SKU: "CS-LTH-15", stock: 8, status: "Low Stock" }
];

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans antialiased flex">
      
      {/* 1. COLLAPSIBLE SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#1E293B] border-r border-[#334155] p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">V</div>
            <span className="text-lg font-bold tracking-tight">VISION-SHOP</span>
          </div>
          
          <nav className="space-y-1.5">
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-indigo-600/10 text-indigo-400 font-medium text-sm transition">
              <Activity className="w-4 h-4" /> Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#94A3B8] hover:bg-[#334155] hover:text-[#F8FAFC] font-medium text-sm transition">
              <ShoppingBag className="w-4 h-4" /> Orders
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#94A3B8] hover:bg-[#334155] hover:text-[#F8FAFC] font-medium text-sm transition">
              <Users className="w-4 h-4" /> Customers
            </a>
          </nav>
        </div>
        
        <div className="border-t border-[#334155] pt-4 flex items-center gap-3">
          <div className="h-8 w-8 bg-slate-500 rounded-full flex items-center justify-center font-semibold text-xs text-white">AD</div>
          <div>
            <p className="text-xs font-semibold">Admin Panel</p>
            <p className="text-[10px] text-[#94A3B8]">admin@visionshop.com</p>
          </div>
        </div>
      </aside>

      {/* MAIN MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
        
        {/* TOP STATUS HEADER WITH COMMAND PALETTE BAR */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
            <p className="text-xs text-[#94A3B8] mt-1">Real-time storefront overview and functional operations monitoring.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Global Fuzzy Search Trigger Box */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#64748B]" />
              <input 
                type="text" 
                placeholder="Search orders, items... (Ctrl+K)" 
                className="w-full bg-[#1E293B] border border-[#334155] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            
            {/* Timeframe Select */}
            <div className="flex items-center bg-[#1E293B] border border-[#334155] rounded-lg p-1 text-xs">
              <button onClick={() => setTimeframe('24h')} className={`px-3 py-1.5 rounded-md font-medium transition ${timeframe === '24h' ? 'bg-indigo-600 text-white' : 'text-[#94A3B8]'}`}>24h</button>
              <button onClick={() => setTimeframe('7d')} className={`px-3 py-1.5 rounded-md font-medium transition ${timeframe === '7d' ? 'bg-indigo-600 text-white' : 'text-[#94A3B8]'}`}>7d</button>
              <button onClick={() => setTimeframe('30d')} className={`px-3 py-1.5 rounded-md font-medium transition ${timeframe === '30d' ? 'bg-indigo-600 text-white' : 'text-[#94A3B8]'}`}>30d</button>
            </div>
          </div>
        </header>

        {/* 2. KPI METRICS SUMMARY CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_DATA.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 flex flex-col justify-between hover:border-[#475569] transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#94A3B8]">{card.title}</span>
                  <div className="p-2 bg-[#334155]/50 rounded-lg text-[#94A3B8]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${card.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {card.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {card.change}
                    </span>
                    <span className="text-[11px] text-[#64748B]">{card.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* OPERATIONAL HUB ROW (TABLE & ALERTS) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* A. ADVANCED DATA TABLE (RECENT ORDERS VIEW) */}
          <div className="lg:col-span-2 bg-[#1E293B]/40 border border-[#334155] rounded-xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-[#334155] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold tracking-wide uppercase text-indigo-400">Incoming Live Orders</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Real-time fulfillment parsing stream.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center gap-1.5"><Filter className="w-3 h-3"/> Filter</button>
                  <button className="p-2 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center gap-1.5"><Download className="w-3 h-3"/> Export</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#334155] text-[11px] font-semibold text-[#64748B] uppercase bg-[#1E293B]/20">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-center">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60 text-xs">
                    {RECENT_ORDERS.map((order, i) => (
                      <tr key={i} className="hover:bg-[#334155]/20 transition group">
                        <td className="py-3.5 px-4 font-mono font-medium text-indigo-400 flex items-center gap-1.5">
                          {order.id} 
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-[#64748B]" />
                        </td>
                        <td className="py-3.5 px-4 font-medium">{order.customer}</td>
                        <td className="py-3.5 px-4 text-[#94A3B8] max-w-[140px] truncate">{order.product}</td>
                        <td className="py-3.5 px-4 font-semibold">{order.amount}</td>
                        <td className="py-3.5 px-4 text-center">
                          {order.status === 'Delivered' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-2.5 h-2.5" /> {order.status}
                            </span>
                          ) : order.status === 'Processing' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-2.5 h-2.5" /> {order.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-full">
                              <AlertTriangle className="w-2.5 h-2.5" /> {order.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-[#1E293B]/20 border-t border-[#334155] text-center">
              <a href="#" className="text-xs text-indigo-400 hover:underline font-medium">View detailed processing queue &rarr;</a>
            </div>
          </div>

          {/* B. DYNAMIC STOCK THRESHOLD CONTROLLER */}
          <div className="bg-[#1E293B]/40 border border-[#334155] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase text-amber-400">Inventory Allocation Alerts</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Automated safety threshold markers triggered.</p>

              <div className="mt-5 space-y-3">
                {STOCK_ALERTS.map((alert, i) => (
                  <div key={i} className="p-3 bg-[#1E293B]/80 rounded-xl border border-[#334155] flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold tracking-tight">{alert.item}</h4>
                      <p className="text-[10px] text-[#64748B] font-mono mt-0.5">SKU: {alert.SKU}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${alert.status === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                        {alert.stock} Left
                      </span>
                      <p className="text-[10px] text-[#94A3B8] mt-1 hover:underline cursor-pointer font-medium">Restock</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition rounded-lg text-xs font-medium text-white shadow-lg shadow-indigo-600/10">
              Open Master Inventory Grid
            </button>
          </div>

        </section>

      </main>
    </div>
  );
}