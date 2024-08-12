const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      "https://jolasanmi.onrender.com",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000",
    ],
  })
);

app.use(express.json());

// Serve static files from the build folder
// app.use(express.static(path.join(__dirname, "build")));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/debtor", require("./routes/debtorRoutes"));
// app.use("/api/stores", require("./routes/storeRoutes")); // Optional

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
