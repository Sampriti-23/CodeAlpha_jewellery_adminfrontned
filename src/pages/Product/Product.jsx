import React, { useState, useEffect } from "react";
import "./Product.css";
import Sidebar from "../../layout/Sidebar";
import { FaSearch, FaPlus, FaEllipsisH, FaTrash, FaEdit } from "react-icons/fa";

// 🔥 EXACT URLS MATCHING YOUR BACKEND ROUTES
const GET_ALL_PRODUCTS_URL = "http://localhost:8000/api/products/getallproducts"; 
const ADD_PRODUCT_URL = "http://localhost:8000/api/products/newproduct"; 
const DELETE_PRODUCT_URL = "http://localhost:8000/api/products/deleteproducts"; 
const UPDATE_PRODUCT_URL = "http://localhost:8000/api/products/updateproducts"; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [currentEditId, setCurrentEditId] = useState(null); 
  
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "", // Starts empty so the user is forced to select one
    price: "",
    countInStock: "",
  });

  // 1. GET ALL PRODUCTS FROM DB
  const fetchProducts = async () => {
    try {
      const response = await fetch(GET_ALL_PRODUCTS_URL); 
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (product) => {
    setIsEditMode(true);
    setCurrentEditId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      countInStock: product.countInStock,
    });
    setIsModalOpen(true);
    setActiveMenuId(null); 
  };

  const handleAddNewClick = () => {
    setIsEditMode(false);
    setCurrentEditId(null);
    setFormData({ name: "", description: "", category: "", price: "", countInStock: "" });
    setIsModalOpen(true);
  };

  // 2. ADD OR UPDATE PRODUCT IN DB
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
    };

    if (isEditMode) {
      try {
        const response = await fetch(`${UPDATE_PRODUCT_URL}/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error("Failed to update product");
        const updatedProduct = await response.json();
        
        const updatedProductsList = products.map((p) => 
          p._id === currentEditId ? updatedProduct : p
        );
        setProducts(updatedProductsList);
        
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product.");
      }
    } else {
      try {
        const response = await fetch(ADD_PRODUCT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error("Failed to create product");
        const savedProduct = await response.json();
        setProducts([savedProduct, ...products]);
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product. Make sure your backend server is running!");
      }
    }

    setIsModalOpen(false); 
    setIsEditMode(false);
    setCurrentEditId(null);
    setFormData({ name: "", description: "", category: "", price: "", countInStock: "" }); 
  };

  // 3. DELETE PRODUCT
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`${DELETE_PRODUCT_URL}/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      const updatedProducts = products.filter(p => p._id !== productId);
      setProducts(updatedProducts);
      setActiveMenuId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="products-page">
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h2>Products</h2>
        </div>

        <div className="action-bar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Product Name or Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="add-btn" onClick={handleAddNewClick}>
            <FaPlus /> Add Product
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th className="action-col"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="bold-text">#{product._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div style={{display: "flex", flexDirection: "column"}}>
                        <span>{product.name}</span>
                        <span style={{fontSize: "11px", color: "#888"}}>
                          {product.description ? product.description.slice(0, 30) : "No description"}...
                        </span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td className="bold-text">₹{product.price}</td>
                    
                    <td>
                      <span className={`qty-indicator ${product.countInStock < 10 ? 'low-stock' : ''}`}>
                         {product.countInStock} units
                      </span>
                    </td>

                    <td className="action-col relative">
                      <button 
                        className="dots-btn" 
                        onClick={() => setActiveMenuId(activeMenuId === product._id ? null : product._id)}
                      >
                        <FaEllipsisH />
                      </button>

                      {activeMenuId === product._id && (
                        <div className="dropdown-menu">
                          <p onClick={() => handleEditClick(product)} className="edit-text">
                            <FaEdit style={{marginRight: "8px"}}/> Edit Product
                          </p>
                          <div className="menu-divider"></div>
                          <p onClick={() => handleDeleteProduct(product._id)} className="delete-text">
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEditMode ? "Edit Product" : "Add New Product"}</h3>
            
            <form onSubmit={handleSubmitForm}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="name" required placeholder="e.g. Silver Ring" value={formData.name} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" required placeholder="Short description..." value={formData.description} onChange={handleInputChange} />
              </div>

              {/* 🔥 UPDATED CATEGORY DROPDOWN 🔥 */}
              <div className="form-group">
                <label>Category</label>
                <select 
                  name="category" 
                  required 
                  value={formData.category} 
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Ring">Ring</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Pendant">Pendant</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" name="price" required placeholder="e.g. 1500" value={formData.price} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Quantity in Stock</label>
                <input type="number" name="countInStock" required placeholder="e.g. 50" value={formData.countInStock} onChange={handleInputChange} />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">{isEditMode ? "Update Product" : "Save Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;