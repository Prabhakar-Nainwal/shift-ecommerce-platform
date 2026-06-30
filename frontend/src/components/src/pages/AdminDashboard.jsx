import React, { useEffect, useState } from "react";
import { getSummary } from "../services/statisticsServices";
import {
  ReceiptText,
  ShoppingCart,
  Users,
  Truck,
  BarChart2,
  UserCircle,
  Tag,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import StatCard from "../components/admin/StatCard";

const TABS = [
  { path: "statistics", label: "STATISTICS", icon: BarChart2 },
  { path: "users", label: "USERS", icon: UserCircle },
  { path: "products", label: "PRODUCTS", icon: ShoppingCart },
  { path: "orders", label: "ORDERS", icon: Truck },
  { path: "category", label: "CATEGORY", icon: Tag },
];

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});

  const fetchSummary = async () => {
    try {
      const res = await getSummary();
      setSummary(res.data.summary || {});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stat cards: Overhauled with clean white gradients fading into subtle brand red/dark accents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Revenue" value={`₹${summary.revenue || 0}`} icon={ReceiptText} gradient="linear-gradient(135deg, #1e1b4b 0%, #111827 100%)" trend="↑ Net Revenue" />
          <StatCard label="Products" value={summary.products || 0} icon={ShoppingCart} gradient="linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" trend="↑ Total Goods" />
          <StatCard label="Users" value={summary.customers || 0} icon={Users} gradient="linear-gradient(135deg, #4b5563 0%, #1f2937 100%)" trend="customers" />
          <StatCard label="Orders" value={summary.orders || 0} icon={Truck} gradient="linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" trend="orders delivered" />
        </div>

        {/* Tab bar / Navigation: Fixed truncation with scrollbar-none and better flex properties */}
        <div className="flex flex-row justify-start md:justify-center border-b border-gray-200 mb-8 overflow-x-auto scrollbar-none max-w-full">
          <nav className="flex gap-2 md:gap-4 min-w-full md:min-w-0 px-2">
            {TABS.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-3 text-[11px] font-bold tracking-wider transition-all duration-200 shrink-0 select-none border-b-2
                  ${isActive
                    ? "text-red-600 border-red-600"
                    : "text-gray-400 border-transparent hover:text-gray-700"}`
                }
              >
                <Icon size={14} className="shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Nested route content renders here */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}