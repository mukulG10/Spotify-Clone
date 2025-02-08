import express from "express";
import cors from "cors";
import "dotenv/config";
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js";

//app config

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

//add middlewares

//handels the all request

//whenever we will get the request this request will be pass through the json methods

app.use(express.json());
//allow frontend to connect with the backend
app.use(cors());

//add initializing routes
app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on ${port}`));
