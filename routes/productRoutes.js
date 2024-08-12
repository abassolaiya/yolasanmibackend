const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProductQuantity,
  getHistoryByProductId,
  getHistory,
  editProduct,
} = require("../controllers/productController");

router.post("/", createProduct);
router.put("/:id", editProduct);
router.get("/", getProducts);
router.get("/history", getHistory);
router.get("/:id", getProductById);
router.put("/:id/:action", updateProductQuantity);
router.get("/:productId/history", getHistoryByProductId);

module.exports = router;
