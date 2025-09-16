const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { dbConnection } = require("./config/config");

const app = express();
const port = process.env.PORT || 5000;

// Mongo DB Connection
dbConnection();

// Middlewares
app.use(cors());
app.use(express.json());

// Entry Point
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Mason Amelia Server" });
});

// Routes
const aircraftRoutes = require("./routes/aircraft.route");
const aircraftCategoryRoutes = require("./routes/aircraftCategory.route");
const brandRoutes = require("./routes/brand.route");
const reviewRoutes = require("./routes/review.route");
const contactRoutes = require("./routes/contact.route");
const teamRoutes = require("./routes/team.route");
const videoRoutes = require("./routes/video.route");
const authRoutes = require("./routes/auth.route");
const authorRoutes = require("./routes/author.route");
const blogRoutes = require("./routes/blog.route");
const blogCategoryRoutes = require("./routes/blogCategory.route");
const analysisRoutes = require("./routes/analysis.route");

// End Points
app.use("/api/aircrafts", aircraftRoutes);
app.use("/api/aircraftCategories", aircraftCategoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contacts", contactRoutes); 
app.use("/api/teams", teamRoutes);  
app.use("/api/videos", videoRoutes);  
app.use("/api/auth", authRoutes);  
app.use("/api/authors", authorRoutes);  
app.use("/api/blogs", blogRoutes);  
app.use("/api/blogCategories", blogCategoryRoutes);  
app.use("/api/analysis", analysisRoutes);  

// Server Listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

