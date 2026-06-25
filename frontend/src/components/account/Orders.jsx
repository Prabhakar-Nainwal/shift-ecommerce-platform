import React from 'react';

export default function Orders() {
  const sampleOrders = [
    { id: '#1024', date: 'June 14, 2026', total: '$149.00', status: 'Delivered' },
    { id: '#0982', date: 'May 28, 2026', total: '$89.50', status: 'Processing' },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Your Page Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
            {sampleOrders.map((order) => (
              <tr key={order.id}>
                <td className="py-4 font-medium text-blue-500">{order.id}</td>
                <td className="py-4">{order.date}</td>
                <td className="py-4">{order.total}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}