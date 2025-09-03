import React, { useState, useRef } from "react";

/**
 * PhotoStep Component
 * Displays a tribute name, step navigation, photo upload, preview grid,
 * download button, and shareable link toggle.
 */
function PhotoStep() {
  // State for uploaded images/videos
  const [mediaItems, setMediaItems] = useState([]);
  // State for toggling the shareable gallery link
  const [enableUploadLink, setEnableUploadLink] = useState(false);
  // The link you want to share (placeholder)
  const [uploadLink, setUploadLink] = useState("https://MyBabboStudioName.com");

  // Ref to the hidden file input
  const fileInputRef = useRef(null);

  // Trigger file input when "Upload" button is clicked
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setMediaItems((prev) => [...prev, ...newMedia]);
  };

  // Placeholder for download functionality
  const handleDownloadPhotos = () => {
    alert("Download functionality not implemented yet!");
  };

  // Copy the shareable link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(uploadLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      {/* Step navigation */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        {["Info", "Theme", "Title Slides", "Gallery", "Effects", "Music", "Preview", "Finalize"].map(
          (step, index) => (
            <div
              key={step}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: index === 3 ? "#ccc" : "#eee", // Highlight current step (step index 3 = "Gallery")
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 5px",
                cursor: "pointer",
              }}
            >
              {index + 1}
            </div>
          )
        )}
      </div>

      {/* Tribute Title & Photo */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src="https://via.placeholder.com/100"
          alt="Main Tribute"
          style={{ borderRadius: "50%", marginBottom: "10px" }}
        />
        <h2>In Loving Memory of John Doe</h2>
      </div>

      {/* Upload and Download Buttons */}
      <div style={{ textAlign: "center" }}>
        <p>
          If you would like your photos in a specific order, please upload or arrange them in the
          order you prefer.
        </p>
        <button onClick={handleUploadClick} style={{ marginRight: "10px" }}>
          Upload Photos / Videos
        </button>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button onClick={handleDownloadPhotos}>Download Photos</button>
      </div>

      {/* Preview Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {mediaItems.map((item, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            {/* If you need video previews, add logic here */}
            <img
              src={item.preview}
              alt={`upload-${index}`}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* Shareable Link Section */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={enableUploadLink}
              onChange={(e) => setEnableUploadLink(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Enable Upload Link
          </label>
        </div>

        {enableUploadLink ? (
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={uploadLink}
              onChange={(e) => setUploadLink(e.target.value)}
              style={{ width: "300px" }}
            />
            <button onClick={handleCopyLink} style={{ marginLeft: "10px" }}>
              Copy
            </button>
          </div>
        ) : (
          <p style={{ fontStyle: "italic" }}>
            Enable the link above to share with friends and family.
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button style={{ marginRight: "10px" }}>Back</button>
        <button>Next</button>
      </div>
    </div>
  );
}

export default PhotoStep;
