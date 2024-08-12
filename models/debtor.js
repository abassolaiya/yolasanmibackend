const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["borrow", "payment"], required: true }, // 'borrow' or 'payment'
});

const debtorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amountOwed: { type: Number, required: true },
  transactionHistory: [transactionSchema],
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Debtor", debtorSchema);
