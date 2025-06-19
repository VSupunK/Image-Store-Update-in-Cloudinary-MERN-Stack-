import React, { useState } from "react";
import axios from "axios";

const OrderForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    projectName: "",
    description: "",
    link: "",
    dueDate: "",
    priority: "urgent",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Please select up to 3 images only.");
      return;
    }
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append("userId", userId); // Replace with actual user auth/session later
    console.log("Submitting with userId =", userId);

    selectedImages.forEach((img) => data.append("images", img));

    try {
      const res = await axios.post("http://localhost:5050/api/orders", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Order submitted successfully!");
      setFormData({
        itemName: "",
        projectName: "",
        description: "",
        link: "",
        dueDate: "",
        priority: "urgent",
      });
      setSelectedImages([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit order.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Submit Order Request
      </h2>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        {[
          {
            name: "itemName",
            label: "Item Name *",
            type: "text",
            required: true,
          },
          {
            name: "projectName",
            label: "Project Name *",
            type: "text",
            required: true,
          },
          { name: "description", label: "Description", type: "textarea" },
          { name: "link", label: "Product Link", type: "url" },
          { name: "dueDate", label: "Due Date", type: "date" },
        ].map(({ name, label, type, required }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full border rounded-md px-3 py-2"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Images (max 3)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600"
          />
        </div>

        {selectedImages.length > 0 && (
          <div className="flex gap-3 mt-3">
            {selectedImages.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover border rounded-md"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`w-full mt-4 px-4 py-2 rounded-md font-semibold text-white ${
            uploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Submitting..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
