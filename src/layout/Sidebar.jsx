import React from "react";
import "./Sidebar.css";
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  // 🔐 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); 
    localStorage.removeItem("token");  
    navigate("/");    
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">Trinkets</div>

      {/* Menu */}
      <nav className="menu">
        <NavLink to="/home" className="menu-item">
          <FaTachometerAlt /> Dashboard
        </NavLink>

        <NavLink to="/orders" className="menu-item">
          <FaShoppingCart /> Orders
        </NavLink>

        <NavLink to="/products" className="menu-item">
          <FaBox /> Products
        </NavLink>

        <NavLink to="/clients" className="menu-item">
          <FaUsers /> Clients
        </NavLink>
      </nav>

      {/* Logout (Pushed to the bottom via CSS) */}
      <div className="menu-item logout" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </div>
    </div>
  );
};

export default Sidebar;