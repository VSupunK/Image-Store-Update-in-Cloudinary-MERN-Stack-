// src/App.jsx
import React from "react";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";

const App = () => {
  const dummyUserId = "12345"; // Replace with actual user ID logic

  return (
    <div>
      <header
        style={{ backgroundColor: "#007BFF", padding: "10px", color: "white" }}
      >
        <h1 style={{ margin: 0, textAlign: "center" }}>
          ExcelTech Order Management
        </h1>
      </header>

      <main
        style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
      >
        <OrderForm userId={dummyUserId} />
        <OrderList userId={dummyUserId} />
      </main>
    </div>
  );
};

export default App;
