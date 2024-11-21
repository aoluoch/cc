import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Upload from "./Upload";
import Video from "./Video";

function ReportIncident({ user }) {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const handleImageUpload = (imageUrl) => {
    setUploadedImages([...uploadedImages, imageUrl]);
  };

  const handleVideoUpload = (videoUrl) => {
    setUploadedVideos([...uploadedVideos, videoUrl]);
  };

  const removeImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
  };

  const removeVideo = (index) => {
    const updatedVideos = uploadedVideos.filter((_, i) => i !== index);
    setUploadedVideos(updatedVideos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incidentData = {
      description,
      latitude,
      longitude,
      images: uploadedImages,
      videos: uploadedVideos,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/incidents`,
        incidentData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Incident reported successfully!");
        setDescription("");
        setLatitude("");
        setLongitude("");
        setUploadedImages([]);
        setUploadedVideos([]);
      } else {
        toast.error("Failed to report the incident.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the incident.");
    }
  };

  return (
    <div className="p-6 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Report a New Incident</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Latitude</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Longitude</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </div>

        {/* Upload Components */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Upload Media</h2>
          <Upload incidentId="temp" onUpload={handleImageUpload} />
          <Video incidentId="temp" onUpload={handleVideoUpload} />
        </div>

        {/* Preview Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Preview Media</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Images */}
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            {/* Videos */}
            {uploadedVideos.map((video, index) => (
              <div key={index} className="relative">
                <video
                  controls
                  className="w-full h-32 object-cover rounded"
                >
                  <source src={video} type="video/mp4" />
                </video>
                <button
                  onClick={() => removeVideo(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
        >
          Submit Incident
        </button>
      </form>
    </div>
  );
}

export default ReportIncident;
