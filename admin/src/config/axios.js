// admin/src/config/axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Remove the /api part here
});

export default instance;
