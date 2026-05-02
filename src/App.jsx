import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Front from "./pages/Front/Front";
import Products from "./pages/Product/Product";
import Clients from "./pages/Clients/Clients";
import Orders from "./pages/Orders/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Front />} />
         <Route path="/home" element={<Dashboard />} />
         <Route path="/products" element={<Products />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;