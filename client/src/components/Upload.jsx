import React, { useEffect, useRef } from 'react';
import axios from 'axios';

function Upload({ incidentId, onUpload }) {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
            {
                cloudName: 'dliokclfn',
                uploadPreset: 'ajalipreset',
                sources: ['local', 'url', 'google_drive', 'dropbox', 'facebook'],
                multiple: true,
                cropping: true,
                maxFiles: 2,
                resourceType: 'auto',
                clientAllowedFormats: ['image', 'video'],
            },
            async (error, result) => {
                if (error) {
                    console.error(error);
                } else if (result.event === 'success') {
                    console.log('Image uploaded');

                    const { secure_url } = result.info;

                    // Payload for the incident image endpoint
                    const payload = {
                        image_url: secure_url,
                    };

                    try {
                        // Post to the incident image endpoint
                        const response = await axios.post(
                            `/incidents/${incidentId}/images`,
                            payload,
                            {
                                withCredentials: true,
                            }
                        );
                        

                        if (response.status === 201) {
                            console.log('Incident image saved', response);
                            onUpload(secure_url); // Trigger the parent handler
                        }
                    } catch (error) {
                        console.error('Error saving incident image:', error);
                    }
                }
            }
        );
    }, [incidentId, onUpload]);

    const handleOpenWidget = () => {
        if (widgetRef.current) {
            widgetRef.current.open();
        }
    };

    return (
        <button
            onClick={handleOpenWidget}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Upload Image
        </button>
    );
}

export default Upload;
