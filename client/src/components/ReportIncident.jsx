import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function ReportIncident({ user }) {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incidentData = {
      description,
      latitude,
      longitude,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/incidents`,
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
