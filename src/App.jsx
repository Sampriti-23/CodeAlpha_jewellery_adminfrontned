import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Front from "./pages/Front/Front";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Front />} />
         <Route path="/home" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;