import React, { useState } from "react";
import "./Sidebar.css";
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to handle mobile menu

  // 🔐 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Toggle Sidebar for mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close Sidebar when a link is clicked (Mobile UX)
  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button className="mobile-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        {/* Header containing Logo and Close Button */}
        <div className="sidebar-header">
          <div className="logo">Trinkets</div>
          <button className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        {/* Menu */}
        <nav className="menu">
          <NavLink to="/home" className="menu-item" onClick={closeSidebar}>
            <FaTachometerAlt /> Dashboard
          </NavLink>

          <NavLink to="/orders" className="menu-item" onClick={closeSidebar}>
            <FaShoppingCart /> Orders
          </NavLink>

          <NavLink to="/products" className="menu-item" onClick={closeSidebar}>
            <FaBox /> Products
          </NavLink>

          <NavLink to="/clients" className="menu-item" onClick={closeSidebar}>
            <FaUsers /> Clients
          </NavLink>
        </nav>

        {/* Logout (Pushed to the bottom via CSS) */}
        <div className="menu-item logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>
      </div>
    </>
  );
};

export default Sidebar;