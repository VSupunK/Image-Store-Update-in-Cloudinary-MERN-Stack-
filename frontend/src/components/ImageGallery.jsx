import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/images")
      .then((res) => {
        setImages(res.data);
        console.log("Fetched images:", res.data); // ✅ Debug log
      })
      .catch((err) => {
        console.error("Failed to fetch images", err);
        setError("Failed to load images");
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Uploaded Images</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {images.length > 0 ? (
          images.map((user) => (
            <div key={user._id} style={{ width: "200px" }}>
              <img
                src={user.image?.url}
                alt={user.name}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
              <p>
                <strong>{user.name}</strong>
              </p>
              <p>{user.username}</p>
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
