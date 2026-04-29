import React, { useState } from "react";
import "./Sidebar.css";
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const Sidebar = () => {
  const [orderOpen, setOrderOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">Trinkets</div>

      {/* Menu */}
      <ul className="menu">
        <li className="menu-item active">
          <FaTachometerAlt /> Dashboard
        </li>

        {/* Orders */}
        <li className="menu-item" onClick={() => setOrderOpen(!orderOpen)}>
          <FaShoppingCart /> Orders
          {orderOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </li>

        {orderOpen && (
          <ul className="submenu">
            <li>New Orders</li>
            <li>Confirmed Orders</li>
            <li>Delivered</li>
          </ul>
        )}

        {/* Products */}
        <li className="menu-item" onClick={() => setProductOpen(!productOpen)}>
          <FaBox /> Products
          {productOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </li>

        {productOpen && (
          <ul className="submenu">
            <li>Earning</li>
            <li>Necklace</li>
            <li>Rings</li>
            <li>Pendant</li>
          </ul>
        )}

        <li className="menu-item">
          <FaUsers /> Clients
        </li>

        <li className="menu-item logout">
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;