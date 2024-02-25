import React, { useState } from "react";
import "./App.css";
import AddBanner from "./Froms/AddBanner";
import AddCategory from "./Froms/AddCategory";
import AddProduct from "./Froms/UploadProduct";

function App() {
  const [selectedTab, setSelectedTab] = useState("ProductForm");

  const openTab = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="App">
      <div className="tabs">
        <div
          className={`tab ${selectedTab === "ProductForm" ? "selected" : ""}`}
          onClick={() => openTab("ProductForm")}
        >
          Add Product
        </div>
        <div
          className={`tab ${selectedTab === "AddCategory" ? "selected" : ""}`}
          onClick={() => openTab("AddCategory")}
        >
          Add Category
        </div>
        <div
          className={`tab ${selectedTab === "AddBanner" ? "selected" : ""}`}
          onClick={() => openTab("AddBanner")}
        >
          Add Banner
        </div>
      </div>
      <div className="content">
        {selectedTab === "ProductForm" && <AddProduct />}
        {selectedTab === "AddCategory" && <AddCategory />}
        {selectedTab === "AddBanner" && <AddBanner />}
      </div>
    </div>
  );
}

export default App;
