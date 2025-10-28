import express from "express";
import 'dotenv/config'
import cors from 'cors'
import connectDB from "./configs/db";
import adminRouter from "./routes/adminRoutes";
import blogRouter from "./routes/blogRoutes";

const startServer = async () => {
  await connectDB();
  // Start your express app here, for example
  console.log("Server ready...");
};

startServer();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local dev
      "https://auto-scribe-two.vercel.app", // Your main frontend
      "https://auto-scribe-880s5tqgy-harshhu045s-projects.vercel.app" // Optional: preview link
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Added OPTIONS for preflight requests
    credentials: true,
  })
);


app.use(express.json());


app.get('/', (req, res) => {
    res.send(("API is working "))
})

app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

const PORT = process.env.PORT || 3000;


// app.listen(PORT, () => {
//     console.log('server is running on port ' + PORT)
// })

export default app;
