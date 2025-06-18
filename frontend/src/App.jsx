// src/App.jsx
import React from "react";
import OrderForm from "./components/OrderForm";

const App = () => {
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
        <OrderForm />
      </main>
    </div>
  );
};

export default App;
