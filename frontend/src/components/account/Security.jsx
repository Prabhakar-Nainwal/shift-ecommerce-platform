import React from 'react';

export default function Security() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Security Settings</h3>
      <div className="space-y-6">
        <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl flex justify-between items-center">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Two-Factor Authentication</h4>
            <p className="text-xs text-gray-500">Secure your account with an extra verification layer.</p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-blue-600">
            Enable
          </button>
        </div>
        
        <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl flex justify-between items-center">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Active Sessions</h4>
            <p className="text-xs text-gray-500">View and manage devices currently logged into your profile.</p>
          </div>
          <button className="text-xs text-gray-500 hover:text-red-500 font-medium">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}