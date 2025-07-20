export const BACKEND_URL =
  import.meta.env.PROD
    ? "https://rayfield-backend.onrender.com" // 🔗 Full backend URL
    : "http://localhost:3000/api"; // Local dev