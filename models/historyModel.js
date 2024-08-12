const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantityChanged: { type: Number, required: true },
  action: { type: String, enum: ["add", "remove"], required: true },
  timestamp: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);

module.exports = History;
