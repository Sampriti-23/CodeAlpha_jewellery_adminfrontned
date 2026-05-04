import React, { useState, useEffect } from "react";
import "./Orders.css";
import Sidebar from "../../layout/Sidebar";
import { FaSearch, FaEllipsisH } from "react-icons/fa";

// 🔥 UPDATE THESE TO MATCH YOUR ACTUAL BACKEND ROUTES
const GET_ALL_ORDERS_URL = "http://localhost:8000/api/order/getallorder"; 
const UPDATE_ORDER_URL = "http://localhost:8000/api/order/updateorder"; // Used for status changes

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null); // Tracks open 3-dot menu
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. FETCH ALL ORDERS FROM DATABASE
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(GET_ALL_ORDERS_URL, { headers });
        
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const ordersData = Array.isArray(data) ? data : (data.data || []);
        
        setOrders(ordersData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 2. UPDATE ORDER STATUS IN DATABASE
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      // Call the backend to update the status
      const response = await fetch(`${UPDATE_ORDER_URL}/${orderId}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedOrder = await response.json();

      // Update the local UI state so the change is instant
      const updatedOrdersList = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrdersList);
      setActiveMenuId(null); // Close menu

    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status.");
    }
  };

  // Filter orders based on search (Client Name, Order ID, or Product Name)
  const filteredOrders = orders.filter((o) => {
    const orderIdMatch = o._id && o._id.toLowerCase().includes(searchQuery.toLowerCase());
    const clientMatch = o.clientName && o.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    // Search through the array of items to see if any product name matches
    const productMatch = o.orderItems && o.orderItems.some(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return orderIdMatch || clientMatch || productMatch;
  });

  return (
    <div className="orders-page">
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h2>Orders</h2>
        </div>

        {error && (
          <div style={{ color: "red", padding: "10px", background: "#ffe6e6", borderRadius: "8px", marginBottom: "20px" }}>
            Error: {error}
          </div>
        )}

        <div className="action-bar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Client, Order ID, or Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Products Purchased</th>
                <th>Total Price</th>
                <th>Status</th>
                <th className="action-col"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="no-data">Loading orders...</td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    {/* Using last 6 characters of Mongo ID for cleaner display */}
                    <td className="bold-text text-muted">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="bold-text">{order.clientName}</td>
                    
                    {/* Map through the items array since a cart can have multiple products */}
                    <td>
                      {order.orderItems && order.orderItems.map((item, index) => (
                        <div key={index} style={{ fontSize: "13px", marginBottom: "2px" }}>
                          {item.qty}x {item.name}
                        </div>
                      ))}
                    </td>
                    
                    <td className="bold-text">₹{order.totalPrice}</td>
                    
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="action-col relative">
                      <button 
                        className="dots-btn" 
                        onClick={() => setActiveMenuId(activeMenuId === order._id ? null : order._id)}
                      >
                        <FaEllipsisH />
                      </button>

                      {activeMenuId === order._id && (
                        <div className="dropdown-menu">
                          <p onClick={() => handleStatusChange(order._id, "Pending")}>Mark as Pending</p>
                          <p onClick={() => handleStatusChange(order._id, "Processing")}>Mark as Processing</p>
                          <p onClick={() => handleStatusChange(order._id, "Shipped")}>Mark as Shipped</p>
                          <p onClick={() => handleStatusChange(order._id, "Delivered")}>Mark as Delivered</p>
                          <div className="menu-divider"></div>
                          <p onClick={() => handleStatusChange(order._id, "Cancelled")} className="cancel-text" style={{color: "red"}}>
                            Cancel Order
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No orders found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;