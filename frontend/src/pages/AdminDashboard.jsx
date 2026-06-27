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
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/admin/StatCard";
import Statistics from "../components/admin/Statistics";
import UsersTab from "../components/admin/UsersTab";
import ProductsTab from "../components/admin/ProductsTab";
import OrdersTab from "../components/admin/OrdersTab";
import CategoryTab from "../components/admin/CategoryTab";


const TABS = [
  { key: "statistics", label: "STATISTICS", icon: BarChart2 },
  { key: "users", label: "USERS", icon: UserCircle },
  { key: "products", label: "PRODUCTS", icon: ShoppingCart },
  { key: "orders", label: "ORDERS", icon: Truck },
  { key: "category", label: "CATEGORY", icon: Tag },
];


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("statistics");


  const [summary, setSummary] = useState({})
  const fetchSummary = async () => {
    try {
      const res = await getSummary();

      setSummary(res.data.summary);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const tabContent = {
    statistics: <Statistics />,
    users: <UsersTab />,
    products: <ProductsTab />,
    orders: <OrdersTab />,
    category: <CategoryTab />,
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Revenue" value={`₹${summary.revenue || 0}`} icon={ReceiptText} gradient="linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" trend="↑ Net Revenue" />
          <StatCard label="Products" value={summary.products || 0} icon={ShoppingCart} gradient="linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" trend="↑ Total Goods" />
          <StatCard label="Users" value={summary.customers || 0} icon={Users} gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)" trend="customers" />
          <StatCard label="Orders" value={summary.orders || 0} icon={Truck} gradient="linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)" trend="orders delivered" />
        </div>

        {/* Tab bar */}
        <div className="flex flex-row justify-center border-b border-gray-200 mb-8 gap-0 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-5 py-3 text-xs font-semibold tracking-wide transition whitespace-nowrap
                ${activeTab === key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400 hover:text-gray-600"}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>{tabContent[activeTab]}</div>
      </div>
    </div>
  );
}