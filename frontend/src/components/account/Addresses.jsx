import React from 'react';

export default function Addresses() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Saved Addresses</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="p-4 border border-blue-200 bg-blue-50 bg-opacity-30 rounded-xl">
          <span className="text-xs font-bold uppercase text-blue-500">Default Billing Address</span>
          <p className="text-sm font-semibold text-gray-800 mt-2">IvKate Surname</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Ukraine, Kiev<br />
            Main Street Block B, Apt 4<br />
            +380 44 123 45 67
          </p>
        </div>

        <div className="p-4 border border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50">
          <button className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <span>+ Add New Address</span>
          </button>
        </div>

      </div>
    </div>
  );
}