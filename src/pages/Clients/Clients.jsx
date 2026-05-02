import React, { useState, useEffect } from "react";
import "./Clients.css";
import Sidebar from "../../layout/Sidebar";
import { FaSearch } from "react-icons/fa";

const Clients = () => {
  // Initial dummy data for clients
  const initialClients = [
    { id: "#C001", name: "Alice Johnson", email: "alice.j@example.com", address: "123 Maple Street, NY", joined: "12/04/2024" },
    { id: "#C002", name: "Robert Smith", email: "robert.smith@example.com", address: "456 Oak Avenue, CA", joined: "10/04/2024" },
    { id: "#C003", name: "Maria Garcia", email: "maria.g@example.com", address: "789 Pine Road, TX", joined: "08/04/2024" },
    { id: "#C004", name: "James Williams", email: "james.w@example.com", address: "321 Elm Street, FL", joined: "05/04/2024" },
    { id: "#C005", name: "Sophia Brown", email: "sophia.b@example.com", address: "654 Birch Lane, WA", joined: "01/04/2024" },
  ];

  // Load from LocalStorage or use initial data
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("trinkets_clients");
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Save to LocalStorage whenever clients array changes
  useEffect(() => {
    localStorage.setItem("trinkets_clients", JSON.stringify(clients));
  }, [clients]);

  // Filter clients based on search (Name or Email)
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to get initials for the avatar
  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <div className="clients-page">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        
        {/* Top Header Section */}
        <div className="page-header">
          <h2>Clients List</h2>
        </div>

        {/* Action Bar: Search */}
        <div className="action-bar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Name or Email..."
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
                <th>Client ID</th>
                <th>Client Name</th>
                <th>Email Address</th>
                <th>Shipping Address</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td className="bold-text text-muted">{client.id}</td>
                    
                    {/* Name with Avatar */}
                    <td>
                      <div className="client-name-cell">
                        <div className="avatar">{getInitials(client.name)}</div>
                        <span className="bold-text">{client.name}</span>
                      </div>
                    </td>
                    
                    <td>{client.email}</td>
                    <td className="address-text">{client.address}</td>
                    <td>{client.joined}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">No clients found matching your search.</td>
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