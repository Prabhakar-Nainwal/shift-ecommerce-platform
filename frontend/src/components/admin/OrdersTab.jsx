

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderServices";

import React from "react";
const OrdersTab = () => {
  const statusFlow = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };
  const [expanded, setExpanded] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {[
              "",
              "User Name",
              "Email",
              "Phone Number",
              "Total Amount",
              "Order Created Date",
              "Status",
            ].map((h, i) => (
              <th
                key={i}
                className="text-blue-600 font-semibold text-left px-4 py-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <tr
                className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                onClick={() =>
                  setExpanded(expanded === order._id ? null : order._id)
                }
              >
                <td className="px-4 py-3 text-gray-400">
                  {expanded === order._id ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {order.user?.name}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {order.user?.email}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {order.user?.phone}
                </td>

                <td className="px-4 py-3 text-gray-700 font-medium">
                  ₹{order.totalAmount}
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td onClick={e=>e.stopPropagation()} className="px-4 py-3">
                  <select
                    value={order.orderStatus}
                    onClick={(e)=>e.stopPropagation()}
                    onChange={(e) =>{
                      e.stopPropagation();    
                      handleStatus(order._id, e.target.value)}
                    }
                    className={`border rounded-md px-2 py-1 text-sm ${order.orderStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.orderStatus === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "Shipped"
                            ? "bg-purple-100 text-purple-700"
                            : order.orderStatus === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                      }`}
                  ><option value={order.orderStatus}>
                      {order.orderStatus}
                    </option>

                    {statusFlow[order.orderStatus].map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>

              {expanded === order._id && (
                <tr className="bg-gray-50">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="text-sm text-gray-600 mb-4 space-y-1">
                      <p>
                        Address: {order.shippingAddress?.street}
                      </p>

                      <p>
                        Zip Code: {order.shippingAddress?.zip}
                      </p>

                      <p>
                        City: {order.shippingAddress?.city}
                      </p>

                      <p>
                        State: {order.shippingAddress?.state}
                      </p>

                      <p>
                        Status:
                        <span className="ml-2 font-medium text-blue-600">
                          {order.orderStatus}
                        </span>
                      </p>
                    </div>

                    {order.items.length > 0 && (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            {[
                              "Product Name",
                              "Image",
                              "Price",
                              "Quantity",
                              "Rating",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-blue-600 font-semibold text-left px-3 py-2"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {order.items.map((item) => (
                            <tr
                              key={item._id}
                              className="border-b border-gray-100"
                            >
                              <td className="px-3 py-3 text-gray-700">
                                {item.product?.name}
                              </td>

                              <td className="px-3 py-2">
                                <img
                                  src={item.product?.coverImage}
                                  alt={item.product?.name}
                                  className="h-14 w-14 object-contain"
                                />
                              </td>

                              <td className="px-3 py-3 text-gray-700">
                                ₹{item.product?.price}
                              </td>

                              <td className="px-3 py-3 text-gray-700">
                                {item.quantity}
                              </td>

                              <td className="px-3 py-3 text-gray-700">
                                {item.product?.rating}
                              </td>
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
    </div>
  );
};

export default OrdersTab