import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:5050/api/orders/${userId}`)
  //     .then((res) => setOrders(res.data))
  //     .catch((err) => console.error("Failed to load orders", err));
  // }, [userId]);
  useEffect(() => {
    axios
      .get(`http://localhost:5050/api/orders/${userId}`)
      .then((res) => {
        console.log("Order fetched successfully:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.error("Failed to load orders", err));
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      await axios.delete(`http://localhost:5050/api/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/edit/${id}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Order Requests</h2>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{order.itemName}</h3>
            <span className="text-sm text-gray-600">
              Status: {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-700">{order.description}</p>
          <div className="flex gap-2 mt-2">
            {order.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt="order"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
          {order.status === "pending" && (
            <div className="mt-3 flex gap-4">
              <button
                onClick={() => handleEdit(order._id)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(order._id)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderList;
