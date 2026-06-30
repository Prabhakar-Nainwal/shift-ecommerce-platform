import React from 'react'

export default function Payments() {
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