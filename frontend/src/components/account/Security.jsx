import React from 'react';

export default function Security() {
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