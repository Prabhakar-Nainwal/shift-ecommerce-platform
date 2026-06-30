import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderServices";
import React from "react";
import Loader from "../Loader";

const PAGE_SIZE = 10;

const STATUS_COLORS = {
  Pending:    "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped:    "bg-purple-100 text-purple-700",
  Delivered:  "bg-green-100 text-green-700",
  Cancelled:  "bg-red-100 text-red-700",
  "Out For Delivery": "bg-gray-200 ",
};

const statusFlow = {
  Pending:    ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped:    ["Out For Delivery"],
  "Out For Delivery":  ["Delivered"],
  Delivered:[],
  Cancelled:  [],
};


const OrdersTab = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(search, page);
      setOrders(res.data.data);
      setTotalPages(Math.ceil(res.data.totalOrders / PAGE_SIZE));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          placeholder="Search by name or email…"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["", "User Name", "Email", "Phone Number", "Total Amount", "Order Date", "Status"].map((h, i) => (
                <th key={i} className="text-blue-600 font-semibold text-left px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                {/* Row */}
                <tr
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <td className="px-4 py-3 text-gray-400">
                    {expanded === order._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{order.user?.name}</td>
                  <td className="px-4 py-3 text-gray-600">{order.user?.email}</td>
                  <td className="px-4 py-3 text-gray-600">{order.user?.phone}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">₹{order.totalAmount}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>

                {/* Expanded */}
                {expanded === order._id && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      {/* Address + Status update */}
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Address: {order.shippingAddress?.street}</p>
                          <p>City: {order.shippingAddress?.city}</p>
                          <p>State: {order.shippingAddress?.state}</p>
                          <p>Zip: {order.shippingAddress?.zip}</p>
                        </div>

                        {/* Status dropdown — only if there are next steps */}
                        {statusFlow[order.orderStatus]?.length > 0 && (
                          <div className="flex flex-col gap-1 items-end shrink-0">
                            <span className="text-xs text-gray-400 font-medium">Update Status</span>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatus(order._id, e.target.value)}
                              className={`border rounded-md px-2 py-1.5 text-sm font-medium cursor-pointer ${STATUS_COLORS[order.orderStatus]}`}
                            >
                              <option value={order.orderStatus}>{order.orderStatus}</option>
                              {statusFlow[order.orderStatus].map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Items table */}
                      {order.items.length > 0 && (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              {["Product Name", "Image", "Price", "Quantity", "Rating"].map((h) => (
                                <th key={h} className="text-blue-600 font-semibold text-left px-3 py-2">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item._id} className="border-b border-gray-100">
                                <td className="px-3 py-3 text-gray-700">{item.product?.name}</td>
                                <td className="px-3 py-2">
                                  <img src={item.product?.coverImage} alt={item.product?.name} className="h-14 w-14 object-contain" />
                                </td>
                                <td className="px-3 py-3 text-gray-700">₹{item.product?.price}</td>
                                <td className="px-3 py-3 text-gray-700">{item.quantity}</td>
                                <td className="px-3 py-3 text-gray-700">{item.product?.rating}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">No orders found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 bg-white hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={13} /> Prev
          </button>
          <span className="text-xs text-gray-400 font-medium px-1">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 bg-white hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;