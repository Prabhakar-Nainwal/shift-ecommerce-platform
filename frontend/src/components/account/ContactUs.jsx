import React from "react";

export default function ContactUs() {
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
