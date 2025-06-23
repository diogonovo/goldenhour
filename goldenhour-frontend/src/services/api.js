import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9292',
});

export default api;
