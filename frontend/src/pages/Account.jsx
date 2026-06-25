import { useState } from "react";

// ── Icons (inline SVGs to avoid external deps) ──────────────────────────────

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

const IconPrime = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <rect x="8" y="16" width="48" height="32" rx="4" fill="#00a8e0" />
    <rect x="8" y="16" width="48" height="12" rx="4" fill="#0077a8" />
    <path d="M20 38 L28 30 L32 36 L40 26 L44 34" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconLocation = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <path d="M32 8 C20 8 14 18 14 26 C14 38 32 56 32 56 C32 56 50 38 50 26 C50 18 44 8 32 8Z" fill="#f59e0b" />
    <circle cx="32" cy="26" r="7" fill="white" />
  </svg>
);

const IconBusiness = () => (
  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
    <span className="text-white text-[9px] font-bold leading-tight text-center">amazon<br />business</span>
  </div>
);

const IconCard = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <rect x="6" y="16" width="52" height="32" rx="5" fill="#38bdf8" />
    <rect x="6" y="26" width="52" height="10" fill="#0ea5e9" />
    <rect x="14" y="36" width="14" height="5" rx="2" fill="white" opacity="0.7" />
  </svg>
);

const IconWallet = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
    <path d="M8 20 Q8 14 14 14 L50 14 Q56 14 56 20 V48 Q56 54 50 54 L14 54 Q8 54 8 48Z" fill="#f59e0b" />
    <path d="M8 26 H56" stroke="#d97706" strokeWidth="2" />
    <path d="M14 14 L20 8 L50 8 L56 14" stroke="#d97706" strokeWidth="2" fill="none" />
    <path d="M22 40 Q32 46 42 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
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

// ── Account card data ────────────────────────────────────────────────────────

const cards = [
  {
    id: "orders",
    icon: <IconBox />,
    title: "Your Orders",
    desc: "Track, return, or buy things again",
  },
  {
    id: "security",
    icon: <IconLock />,
    title: "Login & Security",
    desc: "Edit login, name, and mobile number",
  },
  {
    id: "addresses",
    icon: <IconLocation />,
    title: "Your Addresses",
    desc: "Edit addresses for orders and gifts",
  },
  {
    id: "payment",
    icon: <IconCard />,
    title: "Payment Options",
    desc: "Edit or add payment methods",
  },
  {
    id: "contact",
    icon: <IconHeadset />,
    title: "Contact Us",
    desc: "Contact customer service via phone or chat",
  },
];

// ── Sub-page components ──────────────────────────────────────────────────────

function OrdersPage() {
  const orders = [
    { id: "#401-5923012", item: "Sony WH-1000XM5 Headphones", date: "Jun 20, 2025", status: "Delivered", price: "₹24,990" },
    { id: "#402-1834720", item: "Kindle Paperwhite 11th Gen", date: "Jun 15, 2025", status: "Delivered", price: "₹13,999" },
    { id: "#403-9021834", item: "boAt Airdopes 141", date: "Jun 28, 2025", status: "Out for Delivery", price: "₹1,299" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Your Orders</h2>
      {orders.map((o) => (
        <div key={o.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition">
          <div>
            <p className="font-medium text-gray-800">{o.item}</p>
            <p className="text-sm text-gray-500">{o.id} · Ordered {o.date}</p>
          </div>
          <div className="text-right">
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${o.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {o.status}
            </span>
            <p className="text-sm text-gray-600 mt-1">{o.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SecurityPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Login & Security</h2>
      {[
        { label: "Name", value: "Rahul Sharma" },
        { label: "Email", value: "rahul.sharma@email.com" },
        { label: "Mobile Number", value: "+91 98765 43210" },
        { label: "Password", value: "••••••••••••" },
      ].map((row) => (
        <div key={row.label} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{row.label}</p>
            <p className="font-medium text-gray-800 mt-0.5">{row.value}</p>
          </div>
          <button className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
        </div>
      ))}
    </div>
  );
}



function AddressesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Your Addresses</h2>
      {[
        { label: "Home", addr: "42, MG Road, Indiranagar, Bengaluru, Karnataka 560038", default: true },
        { label: "Office", addr: "WeWork Galaxy, 43, Residency Rd, Bengaluru, Karnataka 560025", default: false },
      ].map((a) => (
        <div key={a.label} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">{a.label}</span>
            {a.default && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
          </div>
          <p className="text-sm text-gray-600 mt-1">{a.addr}</p>
          <div className="flex gap-3 mt-3">
            <button className="text-sm text-blue-600 hover:underline">Edit</button>
            <button className="text-sm text-blue-600 hover:underline">Remove</button>
          </div>
        </div>
      ))}
      <button className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition text-sm font-medium">
        + Add New Address
      </button>
    </div>
  );
}


function PaymentPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Payment Options</h2>
      {[
        { type: "Visa", last4: "4242", expiry: "08/27", color: "from-blue-500 to-blue-700" },
        { type: "Mastercard", last4: "8890", expiry: "03/26", color: "from-orange-400 to-red-500" },
      ].map((c) => (
        <div key={c.last4} className={`bg-gradient-to-r ${c.color} rounded-xl p-5 text-white flex justify-between items-end`}>
          <div>
            <p className="text-xs opacity-75 uppercase tracking-wide">{c.type}</p>
            <p className="text-lg font-mono tracking-widest mt-1">•••• •••• •••• {c.last4}</p>
            <p className="text-xs opacity-75 mt-1">Expires {c.expiry}</p>
          </div>
          <button className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg transition">Edit</button>
        </div>
      ))}
      <button className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition text-sm font-medium">
        + Add Payment Method
      </button>
    </div>
  );
}


function ContactPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
      <p className="text-sm text-gray-500">How would you like to reach us?</p>
      {[
        { icon: "📞", title: "Phone", desc: "We'll call you right away", btn: "Call Me" },
        { icon: "💬", title: "Live Chat", desc: "Chat with us in real-time", btn: "Start Chat" },
        { icon: "📧", title: "Email", desc: "We'll respond within 24 hours", btn: "Send Email" },
      ].map((opt) => (
        <div key={opt.title} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <p className="font-medium text-gray-800">{opt.title}</p>
              <p className="text-xs text-gray-500">{opt.desc}</p>
            </div>
          </div>
          <button className="text-sm bg-amber-400 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg transition">
            {opt.btn}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Page map ─────────────────────────────────────────────────────────────────

const pages = {
  orders: <OrdersPage />,
  security: <SecurityPage />,
  addresses: <AddressesPage />,
  payment: <PaymentPage />,
  contact: <ContactPage />,
};

// ── Main App ─────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const [active, setActive] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {!active ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Account</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setActive(card.id)}
                  className="bg-white border border-gray-200 rounded-xl p-6 flex items-start gap-4 text-left hover:shadow-md hover:border-amber-300 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <div className="shrink-0 mt-0.5">{card.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-snug">{card.title}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {pages[active]}
            <button
              onClick={() => setActive(null)}
              className="mt-6 text-sm text-blue-600 hover:underline"
            >
              ← Back to Your Account
            </button>
          </div>
        )}
      </main>
    </div>
  );
}