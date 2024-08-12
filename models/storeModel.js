const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
});

module.exports = mongoose.model("Store", storeSchema);
