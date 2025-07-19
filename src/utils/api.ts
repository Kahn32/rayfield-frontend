export const BACKEND_URL =
  import.meta.env.PROD
    ? "https://your-backend-project.vercel.app/api" // 🔗 Full backend URL
    : "http://localhost:3000/api"; // Local dev