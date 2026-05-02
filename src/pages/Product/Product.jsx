import React, { useState, useEffect } from "react";
import "./Product.css";
import Sidebar from "../../layout/Sidebar";
import { FaSearch, FaPlus, FaEllipsisH, FaTrash } from "react-icons/fa";

const Products = () => {
  // Initial dummy data (now using quantity instead of status)

  // Load data from LocalStorage
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("trinkets_products");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null); // Tracks open 3-dot menu

  // Form State (Updated for quantity)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    price: "",
    quantity: "",
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
      id: formData.id.startsWith("#") ? formData.id : `#${formData.id}`,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };
    
    setProducts([newProduct, ...products]);
    setIsModalOpen(false); 
    setFormData({ id: "", name: "", type: "", price: "", quantity: "" }); 
  };

  // Delete Product
  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    setActiveMenuId(null); // Close menu
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="products-page">
      {/* Sidebar */}
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
                <th>Quantity</th>
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
                    
                    {/* Quantity Cell */}
                    <td>
                      <span className={`qty-indicator ${product.quantity < 10 ? 'low-stock' : ''}`}>
                         {product.quantity} units
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
                          <p onClick={() => handleDeleteProduct(product.id)} className="delete-text">
                            <FaTrash style={{marginRight: "8px"}}/> Delete Product
                          </p>
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

      {/* Add Product Modal */}
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
              
              {/* Quantity Input Field */}
              <div className="form-group">
                <label>Quantity in Stock</label>
                <input type="number" name="quantity" required placeholder="e.g. 50" value={formData.quantity} onChange={handleInputChange} />
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