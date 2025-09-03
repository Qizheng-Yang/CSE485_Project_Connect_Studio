import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';


export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.filename; // Return the filename from the server
};

export const processData = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/process`, data);
  return response;
};
