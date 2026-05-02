import React from "react";
import "./Dashboard.css";
import Sidebar from "../../layout/Sidebar";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar Area */}
      <Sidebar/>
      {/* Main Content Area (Covers the rest of the page) */}
      <div className="main-content">
        <div className="page-header">
          <h2>Dashboard</h2>
        </div>
        {/* Top Cards */}
        <div className="cards">
          <div className="card">
            <h4>Products</h4>
            <h2>120</h2>
          </div>
          <div className="card">
            <h4>Amount Received</h4>
            <h2>₹54,890</h2>
          </div>
          <div className="card">
            <h4>Amount Due</h4>
            <h2>₹12,400</h2>
          </div>
          <div className="card">
            <h4>New Orders</h4>
            <h2>45</h2>
          </div>
          <div className="card">
            <h4>Confirmed Orders</h4>
            <h2>80</h2>
          </div>
          <div className="card">
            <h4>Delivered Orders</h4>
            <h2>60</h2>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom">
          {/* Graph */}
          <div className="graph">
            <h3>Sales Analytics</h3>
            <div className="bars">
              {[30, 60, 40, 80, 70, 50, 20, 75,80, 90, 70, 35,50,65,60,45,30,25,35].map((h, i) => (
                <div key={i} className="bar" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="insights">
            <h3>Customer Insights</h3>
            <div className="insight-item">
              <span>New Customers</span>
              <b>15</b>
            </div>
            <div className="insight-item">
              <span>Total Customers</span>
              <b>2,847</b>
            </div>

            <div className="top-customers">
              <h4>Top Customers</h4>
              <div className="customer">
                <span>Alice Johnson</span>
                <b>₹2,340</b>
              </div>
              <div className="customer">
                <span>Robert Smith</span>
                <b>₹1,890</b>
              </div>
              <div className="customer">
                <span>Maria Garcia</span>
                <b>₹1,650</b>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;