import axios from "axios";

const api = axios.create({
  baseURL: "https://smartchain-nexus-3.onrender.com",
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;