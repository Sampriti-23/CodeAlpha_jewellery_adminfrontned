import React, { useState, useEffect } from "react";
import "./Orders.css";
import Sidebar from "../../layout/Sidebar";
import { FaSearch, FaEllipsisH } from "react-icons/fa";

const Orders = () => {
  // Initial dummy data for orders
  const initialOrders = [
    { id: "#ORD001", clientName: "Alice Johnson", productId: "#P1001", productName: "Gold Plated Ring", price: 1200, status: "Pending" },
    { id: "#ORD002", clientName: "Robert Smith", productId: "#P1002", productName: "Silver Necklace", price: 2500, status: "Processing" },
    { id: "#ORD003", clientName: "Maria Garcia", productId: "#P1003", productName: "Diamond Earrings", price: 8900, status: "Delivered" },
    { id: "#ORD004", clientName: "James Williams", productId: "#P1001", productName: "Gold Plated Ring", price: 1200, status: "Cancelled" },
    { id: "#ORD005", clientName: "Sophia Brown", productId: "#P1004", productName: "Platinum Bracelet", price: 4500, status: "Pending" },
  ];

  // Load from LocalStorage or use initial data
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("trinkets_orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null); // Tracks open 3-dot menu

  // Save to LocalStorage whenever orders array changes
  useEffect(() => {
    localStorage.setItem("trinkets_orders", JSON.stringify(orders));
  }, [orders]);

  // Handle Status Change from Dropdown
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setActiveMenuId(null); // Close menu
  };

  // Filter orders based on search (Client Name or Order ID)
  const filteredOrders = orders.filter(
    (o) =>
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="orders-page">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        
        {/* Top Header Section */}
        <div className="page-header">
          <h2>Orders</h2>
        </div>

        {/* Action Bar: Search */}
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

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Status</th>
                <th className="action-col"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="bold-text text-muted">{order.id}</td>
                    <td className="bold-text">{order.clientName}</td>
                    <td className="text-muted">{order.productId}</td>
                    <td>{order.productName}</td>
                    <td className="bold-text">₹{order.price}</td>
                    
                    {/* Dynamic Status Badge */}
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* 3 Dots Menu */}
                    <td className="action-col relative">
                      <button 
                        className="dots-btn" 
                        onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)}
                      >
                        <FaEllipsisH />
                      </button>

                      {/* Dropdown Menu for Status Update */}
                      {activeMenuId === order.id && (
                        <div className="dropdown-menu">
                          <p onClick={() => handleStatusChange(order.id, "Pending")}>Mark as Pending</p>
                          <p onClick={() => handleStatusChange(order.id, "Processing")}>Mark as Processing</p>
                          <p onClick={() => handleStatusChange(order.id, "Delivered")}>Mark as Delivered</p>
                          <div className="menu-divider"></div>
                          <p onClick={() => handleStatusChange(order.id, "Cancelled")} className="cancel-text">
                            Cancel Order
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No orders found matching your search.</td>
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