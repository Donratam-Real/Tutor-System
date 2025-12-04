import axios from 'axios';

// Create an axios instance.
// The "proxy" in package.json will automatically redirect requests from here to http://localhost:8080
const api = axios.create();

// You can also add interceptors here if needed, for example, to add the auth token.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
