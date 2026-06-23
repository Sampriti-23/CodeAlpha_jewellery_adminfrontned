import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "../../layout/Sidebar";

// 🔥 UPDATE THESE TO MATCH YOUR ACTUAL BACKEND ROUTES
const GET_ALL_PRODUCTS_URL = "https://codealpha-jewellery-backend.onrender.com/api/products/getallproducts";
const GET_ALL_USERS_URL = "https://codealpha-jewellery-backend.onrender.com/api/user/getalluser";
const GET_ALL_ORDERS_URL = "https://codealpha-jewellery-backend.onrender.com/api/orders/getallorders"; // Assuming you have this route

const Dashboard = () => {
  const [stats, setStats] = useState({
    productsCount: 0,
    amountReceived: 0,
    amountDue: 0,
    newOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    newCustomers: 0,
  });

  const [topCustomers, setTopCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // Fetch all data concurrently for better performance
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch(GET_ALL_PRODUCTS_URL), // Usually public
          fetch(GET_ALL_USERS_URL, { headers }), // Usually protected
          fetch(GET_ALL_ORDERS_URL, { headers }).catch(() => null), // Catch if orders route doesn't exist yet
        ]);

        if (!productsRes.ok) throw new Error("Failed to fetch products");
        if (!usersRes.ok) throw new Error("Failed to fetch users");

        const productsData = await productsRes.json();
        const usersData = await usersRes.json();
        
        let ordersData = [];
        if (ordersRes && ordersRes.ok) {
          ordersData = await ordersRes.json();
        }

        // Normalize data arrays
        const products = Array.isArray(productsData) ? productsData : (productsData.data || []);
        const users = Array.isArray(usersData) ? usersData : (usersData.data || []);
        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);

        // --- CALCULATIONS ---

        // 1. Customers
        const normalClients = users.filter((u) => u.isAdmin === false || u.isAdmin === undefined);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newClients = normalClients.filter((u) => new Date(u.createdAt) > thirtyDaysAgo);

        // 2. Orders & Financials
        let totalReceived = 0;
        let totalDue = 0;
        let pendingCount = 0;
        let processingCount = 0;
        let deliveredCount = 0;

        const customerSpending = {};

        orders.forEach((order) => {
          // Status Counts
          const status = order.status ? order.status.toLowerCase() : "";
          if (status === "pending") pendingCount++;
          else if (status === "processing" || status === "confirmed") processingCount++;
          else if (status === "delivered") deliveredCount++;

          // Financials (Assuming delivered/processing is received, pending is due)
          const price = Number(order.totalPrice) || 0;
          if (status === "delivered" || status === "processing" || status === "confirmed") {
            totalReceived += price;
          } else if (status === "pending") {
            totalDue += price;
          }

          // Top Customers Aggregation (Grouping by clientName)
          const clientName = order.clientName || "Unknown Client";
          if (status !== "cancelled") {
            if (!customerSpending[clientName]) {
              customerSpending[clientName] = 0;
            }
            customerSpending[clientName] += price;
          }
        });

        // Sort customers by spending and take top 3
        const sortedTopCustomers = Object.keys(customerSpending)
          .map((name) => ({ name, totalSpent: customerSpending[name] }))
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 3);

        // Update State
        setStats({
          productsCount: products.length,
          amountReceived: totalReceived,
          amountDue: totalDue,
          newOrders: pendingCount,
          confirmedOrders: processingCount,
          deliveredOrders: deliveredCount,
          totalCustomers: normalClients.length,
          newCustomers: newClients.length,
        });

        setTopCustomers(sortedTopCustomers);
        setIsLoading(false);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h2>Dashboard</h2>
        </div>

        {error && (
          <div style={{ color: "red", padding: "10px", background: "#ffe6e6", borderRadius: "8px", marginBottom: "20px" }}>
            Failed to load data: {error}
          </div>
        )}

        {/* Top Cards */}
        <div className="cards">
          <div className="card">
            <h4>Products</h4>
            <h2>{isLoading ? "..." : stats.productsCount}</h2>
          </div>
          <div className="card">
            <h4>Amount Received</h4>
            <h2>{isLoading ? "..." : `₹${stats.amountReceived.toLocaleString()}`}</h2>
          </div>
          <div className="card">
            <h4>Amount Due</h4>
            <h2>{isLoading ? "..." : `₹${stats.amountDue.toLocaleString()}`}</h2>
          </div>
          <div className="card">
            <h4>New Orders</h4>
            <h2>{isLoading ? "..." : stats.newOrders}</h2>
          </div>
          <div className="card">
            <h4>Confirmed Orders</h4>
            <h2>{isLoading ? "..." : stats.confirmedOrders}</h2>
          </div>
          <div className="card">
            <h4>Delivered Orders</h4>
            <h2>{isLoading ? "..." : stats.deliveredOrders}</h2>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom">
          {/* Static Graph as requested */}
          <div className="graph">
            <h3>Sales Analytics</h3>
            <div className="bars">
              {[30, 60, 40, 80, 70, 50, 20, 75, 80, 90, 70, 35, 50, 65, 60, 45, 30, 25, 35].map((h, i) => (
                <div key={i} className="bar" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          {/* Dynamic Customer Insights */}
          <div className="insights">
            <h3>Customer Insights</h3>
            <div className="insight-item">
              <span>New Customers (Last 30 Days)</span>
              <b>{isLoading ? "..." : stats.newCustomers}</b>
            </div>
            <div className="insight-item">
              <span>Total Customers</span>
              <b>{isLoading ? "..." : stats.totalCustomers.toLocaleString()}</b>
            </div>

            <div className="top-customers">
              <h4>Top Customers</h4>
              {isLoading ? (
                <p style={{ color: "#888", fontSize: "14px" }}>Loading data...</p>
              ) : topCustomers.length > 0 ? (
                topCustomers.map((customer, index) => (
                  <div className="customer" key={index}>
                    <span>{customer.name}</span>
                    <b>₹{customer.totalSpent.toLocaleString()}</b>
                  </div>
                ))
              ) : (
                <p style={{ color: "#888", fontSize: "14px" }}>No order data available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;