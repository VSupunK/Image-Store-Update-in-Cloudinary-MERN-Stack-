import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    projectName: "",
    description: "",
    link: "",
    dueDate: "",
    priority: "medium",
  });

  const [existingImages, setExistingImages] = useState([]); // existing images
  const [newImages, setNewImages] = useState([]); // new selected files
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState([]); // to delete on backend
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5050/api/orders/single/${id}`)
      .then((res) => {
        const order = res.data;
        setFormData({
          itemName: order.itemName,
          projectName: order.projectName,
          description: order.description,
          link: order.link,
          dueDate: order.dueDate?.slice(0, 10),
          priority: order.priority,
        });
        setExistingImages(order.images || []);
      })
      .catch((err) => {
        console.error("Failed to load order", err);
        setMessage("❌ Failed to load order data");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length > 3) {
      alert("You can only upload up to 3 images in total.");
      return;
    }
    setNewImages(files);
  };

  const handleRemoveExistingImage = (publicId) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.publicId !== publicId)
    );
    setRemovedImagePublicIds((prev) => [...prev, publicId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    newImages.forEach((file) => data.append("images", file));
    removedImagePublicIds.forEach((pid) => data.append("remove", pid));

    try {
      const res = await axios.put(
        `http://localhost:5050/api/orders/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage("✅ Order updated successfully");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Failed to update order");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Order Request</h2>
      {message && <p className="mb-4 font-semibold text-center">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        {Object.entries(formData).map(([name, value]) =>
          name !== "priority" ? (
            <div key={name}>
              <label className="block font-medium mb-1 capitalize">
                {name.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={name === "dueDate" ? "date" : "text"}
                name={name}
                value={value}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ) : null
        )}

        <div>
          <label className="block mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Uploaded Images</label>
          <div className="flex gap-4">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img.url}
                  alt="uploaded"
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(img.publicId)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Add New Images (Max 3 total)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleNewImageSelect}
            className="block w-full"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          {uploading ? "Updating..." : "Update Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderEditForm;
