import React, { useState, useEffect } from "react";
import "./Product.css";
import Sidebar from "../../layout/Sidebar";
import { FaSearch, FaPlus, FaEllipsisH } from "react-icons/fa";

const Products = () => {
  // Initial dummy data just in case local storage is empty
  const initialData = [
    { id: "#P1001", name: "Gold Plated Ring", type: "Ring", price: 1200, status: "Ordered" },
    { id: "#P1002", name: "Silver Necklace", type: "Necklace", price: 2500, status: "Confirmed" },
    { id: "#P1003", name: "Diamond Earrings", type: "Earrings", price: 8900, status: "Delivered" },
  ];

  // Load data from LocalStorage on first render, or use initialData
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("trinkets_products");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null); // Tracks which 3-dot menu is open

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    price: "",
    status: "Ordered",
  });

  // Save to LocalStorage whenever products array changes
  useEffect(() => {
    localStorage.setItem("trinkets_products", JSON.stringify(products));
  }, [products]);

  // Handle Input Changes for Add Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add New Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      // Ensure ID has a # prefix for styling consistency
      id: formData.id.startsWith("#") ? formData.id : `#${formData.id}`,
      price: Number(formData.price),
    };
    
    setProducts([newProduct, ...products]);
    setIsModalOpen(false); // Close Modal
    setFormData({ id: "", name: "", type: "", price: "", status: "Ordered" }); // Reset Form
  };

  // Change Status Logic
  const handleStatusChange = (productId, newStatus) => {
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, status: newStatus } : p
    );
    setProducts(updatedProducts);
    setActiveMenuId(null); // Close menu after selection
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="products-page">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        
        {/* Top Header Section */}
        <div className="page-header">
          <h2>Products</h2>
        </div>

        {/* Action Bar: Search & Add */}
        <div className="action-bar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Product ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th className="action-col"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="bold-text">{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.type}</td>
                    <td className="bold-text">₹{product.price}</td>
                    <td>
                      <span className={`status-badge ${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="action-col relative">
                      {/* 3 Dots Button */}
                      <button 
                        className="dots-btn" 
                        onClick={() => setActiveMenuId(activeMenuId === product.id ? null : product.id)}
                      >
                        <FaEllipsisH />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === product.id && (
                        <div className="dropdown-menu">
                          <p onClick={() => handleStatusChange(product.id, "Ordered")}>Mark as Ordered</p>
                          <p onClick={() => handleStatusChange(product.id, "Confirmed")}>Mark as Confirmed</p>
                          <p onClick={() => handleStatusChange(product.id, "Delivered")}>Mark as Delivered</p>
                           <p onClick={() => handleStatusChange(product.id, "Cancelled")}>Mark as Cancelled</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Popup) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product ID</label>
                <input type="text" name="id" required placeholder="e.g. P1004" value={formData.id} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="name" required placeholder="e.g. Silver Ring" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input type="text" name="type" required placeholder="e.g. Ring" value={formData.type} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" name="price" required placeholder="e.g. 1500" value={formData.price} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Ordered">Ordered</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;