const express = require("express");
const router = express.Router();
const Debtor = require("../models/debtor");

// Add a new debtor
router.post("/", async (req, res) => {
  const { name, amountOwed } = req.body;
  const debtor = new Debtor({
    name,
    amountOwed,
    transactionHistory: [{ amount: amountOwed, type: "borrow" }],
  });

  await debtor.save();
  res.status(201).send(debtor);
});

// Get all debtors
router.get("/", async (req, res) => {
  const debtors = await Debtor.find();
  res.send(debtors);
});

// Get a debtor by ID
router.get("/:id", async (req, res) => {
  const debtor = await Debtor.findById(req.params.id);
  if (!debtor) return res.status(404).send("Debtor not found");
  res.send(debtor);
});

// Update debtor (add a transaction)
router.put("/:id", async (req, res) => {
  const { amount, type } = req.body;
  const debtor = await Debtor.findById(req.params.id);

  if (!debtor) return res.status(404).send("Debtor not found");

  // Ensure amount is a number before adding or subtracting
  const numericAmount = parseFloat(amount);

  debtor.amountOwed += type === "borrow" ? numericAmount : -numericAmount;
  debtor.transactionHistory.push({ amount: numericAmount, type });
  debtor.lastUpdated = Date.now();

  await debtor.save();
  res.send(debtor);
});

// Delete a debtor
router.delete("/:id", async (req, res) => {
  await Debtor.findByIdAndDelete(req.params.id);
  res.send("Debtor deleted");
});

module.exports = router;
