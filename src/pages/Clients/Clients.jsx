import React, { useState, useEffect } from "react";
import "./Clients.css";
import Sidebar from "../../layout/Sidebar";
import { FaSearch } from "react-icons/fa";

// 🔥 UPDATE THESE TO MATCH YOUR ACTUAL BACKEND ROUTES
const GET_ALL_USERS_URL = "http://localhost:8000/api/user/getalluser"; 
const GET_ALL_DETAILS_URL = "http://localhost:8000/api/details/admin/alldetails"; // Use the admin route!

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. FETCH USERS AND DETAILS FROM DATABASE
 // 1. FETCH USERS AND DETAILS FROM DATABASE
  useEffect(() => {
    const fetchClientsAndDetails = async () => {
      try {
        const token = localStorage.getItem("token"); 
        
        // Setup headers securely
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // --- STEP A: FETCH USERS (CRITICAL) ---
        console.log("1. Fetching users...");
        const usersRes = await fetch(GET_ALL_USERS_URL, { headers });
        
        if (!usersRes.ok) {
          throw new Error(`Failed to fetch users. Server responded with status: ${usersRes.status}`);
        }
        
        const usersJson = await usersRes.json();
        
        // 🔥 FIX 1: Handle both Array [...] and Object { data: [...] } responses
        const usersData = Array.isArray(usersJson) ? usersJson : (usersJson.data || []);
        console.log("2. Users found in DB:", usersData);

        // Filter out Admins (keep users where isAdmin is false or undefined)
        const normalClients = usersData.filter(user => user.isAdmin === false || user.isAdmin === undefined);
        console.log("3. Normal clients after filtering admins:", normalClients);

        // --- STEP B: FETCH DETAILS (OPTIONAL - Won't break the page if it fails) ---
        let detailsData = [];
        try {
          console.log("4. Fetching details...");
          const detailsRes = await fetch(GET_ALL_DETAILS_URL, { headers });
          if (detailsRes.ok) {
            const detailsJson = await detailsRes.json();
            detailsData = Array.isArray(detailsJson) ? detailsJson : (detailsJson.data || []);
            console.log("5. Details found:", detailsData);
          } else {
            console.warn("Details fetch failed (maybe route doesn't exist yet?). Continuing without them.");
          }
        } catch (detailErr) {
          console.warn("Could not reach details route. Continuing without details.");
        }

        // --- STEP C: MERGE DATA ---
        const mergedClients = normalClients.map(user => {
          const userDetails = detailsData.find(detail => detail.user === user._id);
          return {
            ...user,
            phone: userDetails ? userDetails.phone : "Not Provided",
            fullAddress: userDetails ? `${userDetails.address}, ${userDetails.city}` : "Not Provided"
          };
        });

        console.log("6. Final data sent to table:", mergedClients);
        setClients(mergedClients);
        
      } catch (error) {
        console.error("❌ CRITICAL ERROR fetching clients:", error);
      }
    };
    
    fetchClientsAndDetails();
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
                    
                    {/* Display Phone from Details collection */}
                    <td style={{ color: client.phone === "Not Provided" ? "#aaa" : "inherit", fontStyle: client.phone === "Not Provided" ? "italic" : "normal" }}>
                      {client.phone}
                    </td>

                    {/* Display Address from Details collection */}
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