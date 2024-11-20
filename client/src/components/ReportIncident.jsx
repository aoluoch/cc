import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Upload from "./Upload"
import Video from "./Video";

function ReportIncident({ user }) {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      description,
      latitude,
      longitude,
      images: imageUrls,
      videos: videoUrls,
    };

    try {
      const response = await axios.post("http://localhost:5000/incidents", payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Incident reported successfully!");
        setDescription("");
        setLatitude("");
        setLongitude("");
        setImageUrls([]);
        setVideoUrls([]);
      } else {
        toast.error("Failed to report the incident.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the incident.");
    }
  };

  const handleAddUrl = (setter) => {
    setter((urls) => [...urls, ""]);
  };

  const handleUrlChange = (setter, index, value) => {
    setter((urls) => {
      const updatedUrls = [...urls];
      updatedUrls[index] = value;
      return updatedUrls;
    });
  };

  const handleRemoveUrl = (setter, index) => {
    setter((urls) => urls.filter((_, i) => i !== index));
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
          <label className="block text-gray-700">Image Upload</label>
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={url}
                onChange={(e) => handleUrlChange(setImageUrls, index, e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => handleRemoveUrl(setImageUrls, index)}
              >
                Remove
              </button>
            </div>
          ))}
          <Upload />
        </div>
        <div>
          <label className="block text-gray-700">Video URLs</label>
          {videoUrls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={url}
                onChange={(e) => handleUrlChange(setVideoUrls, index, e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => handleRemoveUrl(setVideoUrls, index)}
              >
                Remove
              </button>
            </div>
          ))}
          <Video/>
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
