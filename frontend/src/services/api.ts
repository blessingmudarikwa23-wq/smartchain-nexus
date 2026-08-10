import axios from "axios";

const api = axios.create({
  baseURL: "https://smartchain-nexus.onrender.com",
  timeout: 10000,
});

export default api;