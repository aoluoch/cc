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
        "http://localhost:5000/incidents",
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
        <div>
          <label className="block text-gray-700 mb-2">Upload Images</label>
          <Upload
            incidentId="new" // Replace with incident ID if necessary
            onUpload={(url) => setUploadedImages((prev) => [...prev, url])}
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Uploaded"
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Upload Videos</label>
          <Video
            incidentId="new" // Replace with incident ID if necessary
            onUpload={(url) => setUploadedVideos((prev) => [...prev, url])}
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            {uploadedVideos.map((video, index) => (
              <video key={index} controls className="w-full h-32 rounded">
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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