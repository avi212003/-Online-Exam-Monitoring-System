// user/src/config/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',  // Adjust to your backend server URL
});

export default axiosInstance;
