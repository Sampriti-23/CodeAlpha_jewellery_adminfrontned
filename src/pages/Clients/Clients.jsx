import React, { useState, useEffect } from "react";
import "./Clients.css";
import Sidebar from "../../layout/Sidebar";
import { FaSearch } from "react-icons/fa";

const baseurl = "https://codealpha-jewellery-backend.onrender.com";
// 🔥 EXACT URLS MATCHING YOUR BACKEND ROUTES
const GET_ALL_USERS_URL = `${baseurl}/api/user/getalluser`; 
const GET_ALL_ORDERS_URL = `${baseurl}/api/order/getallorder`; 

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // 1. FETCH USERS AND ORDERS FROM DATABASE
  useEffect(() => {
    const fetchClientsAndOrders = async () => {
      try {
        const token = localStorage.getItem("token"); 
        
        // Setup headers securely
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // Fetch Users and Orders at the same time
        const [usersRes, ordersRes] = await Promise.all([
            fetch(GET_ALL_USERS_URL, { headers }),
            fetch(GET_ALL_ORDERS_URL, { headers }).catch(() => null) 
        ]);
        
        if (!usersRes.ok) {
          throw new Error(`Failed to fetch users. Server responded with status: ${usersRes.status}`);
        }
        
        const usersJson = await usersRes.json();
        const usersData = Array.isArray(usersJson) ? usersJson : (usersJson.data || []);

        let ordersData = [];
        if (ordersRes && ordersRes.ok) {
            const ordersJson = await ordersRes.json();
            ordersData = Array.isArray(ordersJson) ? ordersJson : (ordersJson.data || []);
        }

        // Filter out Admins (keep users where isAdmin is false or undefined)
        const normalClients = usersData.filter(user => user.isAdmin === false || user.isAdmin === undefined);

        // --- MERGE DATA ---
        const mergedClients = normalClients.map(user => {
          const userLatestOrder = ordersData.find(order => String(order.user) === String(user._id));
          
          let phone = "Not Provided";
          let fullAddress = "Not Provided";

          if (userLatestOrder && userLatestOrder.shippingAddress) {
              phone = userLatestOrder.shippingAddress.phone || "Not Provided";
              fullAddress = `${userLatestOrder.shippingAddress.address}, ${userLatestOrder.shippingAddress.city}`;
          }

          return {
            ...user,
            phone,
            fullAddress
          };
        });

        setClients(mergedClients);
        
      } catch (err) {
        console.error("❌ CRITICAL ERROR fetching clients:", err);
        setError(err.message);
      }
    };
    
    fetchClientsAndOrders();
  }, []);

  // Filter clients based on search (Name, Email, or Phone)
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const getInitials = (name) => {
    if (!name) return "U"; 
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  return (
    <div className="clients-page">
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h2>Clients List</h2>
        </div>

        {error && (
          <div style={{ color: "red", padding: "10px", background: "#ffe6e6", borderRadius: "8px", marginBottom: "20px" }}>
            Error fetching clients: {error}
          </div>
        )}

        <div className="action-bar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Name, Email, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Client Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Shipping Address</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client._id}>
                    <td className="bold-text text-muted">#{client._id.slice(-6).toUpperCase()}</td>
                    
                    <td>
                      <div className="client-name-cell">
                        <div className="avatar">{getInitials(client.name)}</div>
                        <span className="bold-text">{client.name}</span>
                      </div>
                    </td>
                    
                    <td>{client.email}</td>
                    
                    <td style={{ color: client.phone === "Not Provided" ? "#aaa" : "inherit", fontStyle: client.phone === "Not Provided" ? "italic" : "normal" }}>
                      {client.phone}
                    </td>

                    <td className="address-text" style={{ color: client.fullAddress === "Not Provided" ? "#aaa" : "#666", fontStyle: client.fullAddress === "Not Provided" ? "italic" : "normal" }}>
                      {client.fullAddress}
                    </td>
                    
                    <td>{formatDate(client.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No clients found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;