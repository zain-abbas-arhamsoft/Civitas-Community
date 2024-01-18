const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const app = express();

const users = require("./routes/users");
const organizations = require("./routes/organizations");
dotenv.config();

const httpServer = require("http").createServer(app);


async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

httpServer.listen(process.env.PORT || 4000, () => {});

app.use(express.json({ limit: "10mb" })); // Increase limit to 10MB
app.use(cors());
// Serve static files
app.use("/api/users", users);
app.use("/api/organizations", organizations);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
