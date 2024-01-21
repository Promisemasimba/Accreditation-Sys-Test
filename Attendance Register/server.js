const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pdfRoutes = require("./routes/pdfRoutes");
const registrantRoutes = require("./routes/registrantRoutes");
const delegateRoutes = require("./routes/delegateRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/pdf", pdfRoutes); // PDF-related routes
app.use("/api", registrantRoutes); // Your existing registrant routes
app.use("/api", delegateRoutes); // Your existing delegate routes

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
