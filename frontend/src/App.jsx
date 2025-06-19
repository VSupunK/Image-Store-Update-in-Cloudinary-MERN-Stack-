// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import OrderEditForm from "./components/OrderEditForm"; // ✅ import the edit form

const App = () => {
  const dummyUserId = "12345"; // Replace with actual user ID logic

  return (
    <Router>
      <header
        style={{ backgroundColor: "#007BFF", padding: "10px", color: "white" }}
      >
        <h1 style={{ margin: 0, textAlign: "center" }}>
          ExcelTech Order Management
        </h1>
      </header>

      <Routes>
        {/* ✅ Home page with form and order list */}
        <Route
          path="/"
          element={
            <main
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
                gap: "40px",
              }}
            >
              <OrderForm userId={dummyUserId} />
              <OrderList userId={dummyUserId} />
            </main>
          }
        />

        {/* ✅ Route for editing orders */}
        <Route path="/edit/:id" element={<OrderEditForm />} />
      </Routes>
    </Router>
  );
};

export default App;
