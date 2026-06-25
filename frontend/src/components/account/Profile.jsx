import React from 'react';

export default function Profile() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-300 mb-6 text-center md:text-left">Your personal profile info</h3>
      
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Personal Data */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-500 font-bold uppercase text-sm mb-2">
            <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
            Profile
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">First name</label>
            <input type="text" placeholder="Name" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Last name</label>
            <input type="text" placeholder="Surname" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Username (not your e-mail)</label>
            <input type="text" placeholder="Username" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Your e-mail</label>
            <input type="email" placeholder="mail@example.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        {/* Right Column: Contact & Password */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-500 font-bold uppercase text-sm mb-2">
              <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
              Password
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Old password <span className="text-red-500">*</span></label>
              <input type="password" placeholder="••••••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">New password <span className="text-red-500">*</span></label>
              <input type="password" placeholder="••••••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Confirm new password <span className="text-red-500">*</span></label>
              <input type="password" placeholder="••••••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 md:pt-0 flex justify-end">
            <button type="submit" className="w-full bg-blue-500 text-white font-medium py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors text-sm">
              Correct. Save info
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}