const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const fs = require("fs");
require("dotenv").config();

// Middleware
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../client/public/uploads"), {
    maxAge: "1d",
  }),
);

// Database Connection
mongoose.connect(process.env.MONGODB_URI);

// API Routes
app.use("/api/admin", require("./routes/admin"));
app.use("/api", require("./routes/api"));

// API 404 + error handler (must stay before static so API errors return JSON)
app.use("/api", require("./middleware/notFound"));
app.use(require("./middleware/errorHandler"));

// Serve built React app (production)
const distDir = path.join(__dirname, "../client/dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: "1d" }));
  app.use((req, res, next) => {
    if (req.method === "GET") {
      return res.sendFile(path.join(distDir, "index.html"));
    }
    next();
  });
}

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}