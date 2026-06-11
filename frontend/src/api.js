import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000"; // Assuming 3000 since backend runs on 3000 in dev

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export default api;
