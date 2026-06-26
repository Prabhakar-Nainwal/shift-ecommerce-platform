import { LogOutIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';

const IconBox = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <rect x="8" y="20" width="48" height="34" rx="4" fill="#c8a97a" />
    <rect x="8" y="20" width="48" height="10" rx="2" fill="#b8935a" />
    <path d="M24 20 Q32 14 40 20" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M20 44 Q32 50 44 44" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <rect x="16" y="28" width="32" height="24" rx="5" fill="#9ca3af" />
    <path d="M22 28 V22 a10 10 0 0 1 20 0 V28" stroke="#6b7280" strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="32" cy="40" r="4" fill="white" />
    <line x1="32" y1="44" x2="32" y2="48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
const IconLocation = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <path d="M32 8 C20 8 14 18 14 26 C14 38 32 56 32 56 C32 56 50 38 50 26 C50 18 44 8 32 8Z" fill="#f59e0b" />
    <circle cx="32" cy="26" r="7" fill="white" />
  </svg>
);
const IconCard = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <rect x="6" y="16" width="52" height="32" rx="5" fill="#38bdf8" />
    <rect x="6" y="26" width="52" height="10" fill="#0ea5e9" />
    <rect x="14" y="36" width="14" height="5" rx="2" fill="white" opacity="0.7" />
  </svg>
);
const IconHeadset = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <circle cx="32" cy="32" r="24" fill="#e0f2f1" />
    <path d="M20 32 C20 22 26 16 32 16 C38 16 44 22 44 32" stroke="#0d9488" strokeWidth="3" fill="none" />
    <rect x="16" y="30" width="7" height="12" rx="3" fill="#0d9488" />
    <rect x="41" y="30" width="7" height="12" rx="3" fill="#0d9488" />
    <path d="M44 40 C44 46 38 50 32 50" stroke="#0d9488" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="32" cy="50" r="3" fill="#0d9488" />
  </svg>
);

const cards = [
  { id: "orders",    to: "orders",    icon: <IconBox />,      title: "Your Orders",      desc: "Track, return, or buy things again" },
  { id: "profile",   to: "profile",   icon: <IconBox />,      title: "Your Profile",     desc: "Manage Account" },
  { id: "security",  to: "security",  icon: <IconLock />,     title: "Login & Security", desc: "Edit login, name, and mobile number" },
  { id: "addresses", to: "addresses", icon: <IconLocation />, title: "Your Addresses",   desc: "Edit addresses for orders and gifts" },
  { id: "payment",   to: "payment",   icon: <IconCard />,     title: "Payment Options",  desc: "Edit or add payment methods" },
  { id: "contact",   to: "contactUs",   icon: <IconHeadset />,  title: "Contact Us",       desc: "Contact customer service via phone or chat" },
];

export default function Account() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

const active = location.pathname.replace("/account/", "");
const isBase = location.pathname === "/account";

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Account</h1>

        {/* Grid — original, untouched except Link replaces button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const isActive = active === card.id;
            return (
              <Link
                key={card.id}
                to={isActive ? '/account' : card.to}  // clicking active card collapses outlet
                className={`bg-white border rounded-xl p-6 flex items-start gap-4 text-left
                            active:scale-95 transition-all duration-150
                            focus:outline-none focus:ring-2 focus:ring-amber-400
                            ${isActive
                              ? 'border-amber-400 shadow-md ring-2 ring-amber-100'
                              : 'border-gray-200 hover:shadow-md hover:border-amber-300'
                            }`}
              >
                <div className="shrink-0 mt-0.5">{card.icon}</div>
                <div>
                  <p className={`font-semibold text-sm leading-snug transition-colors duration-150
                                 ${isActive ? 'text-amber-700' : 'text-gray-800'}`}>
                    {card.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Outlet — slides in below grid when a child route is active */}
        {!isBase && (
          <div className="mt-8 transition-all duration-300">
            <div className="pb-5 mb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {cards.find(c => c.id === active)?.title}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {cards.find(c => c.id === active)?.desc}
              </p>
            </div>
            <div className=" p-6 ">
              <Outlet />
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Signed in to <span className="text-gray-700 font-medium">UrbanShop</span>
          </p>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200
                       text-sm font-medium text-gray-500
                       transition-all duration-200
                       hover:border-red-200 hover:text-red-600 hover:bg-red-50
                       active:scale-95"
          >
            <LogOutIcon className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Log out
          </button>
        </div>

      </main>
    </div>
  );
}