const Product = require("../models/productModel");
const History = require("../models/historyModel");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, store } = req.body;
    const product = new Product({ name, quantity, store });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing product
exports.editProduct = async (req, res) => {
  const { name, store, quantity } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, store, quantity },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products (with pagination)
exports.getProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProductsCount = await Product.countDocuments();

    res.json({
      products: products.map((product) => ({
        ...product._doc,
        lowStock: product.quantity < 10,
      })),
      totalPages: Math.ceil(totalProductsCount / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const { page = 1, limit = 10, productName = "", action = "" } = req.query;

  try {
    const query = {};
    if (productName) {
      query.productName = { $regex: productName, $options: "i" }; // Case-insensitive search
    }
    if (action) {
      query.action = action;
    }

    const history = await History.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("productId"); // Populate the product details if needed

    const totalHistoryCount = await History.countDocuments(query);

    res.json({
      history: history.map((entry) => ({
        _id: entry._id,
        productName: entry.productId ? entry.productId.name : "Unknown",
        date: entry.timestamp,
        action: entry.action,
        quantityChanged: entry.quantityChanged,
      })),
      totalPages: Math.ceil(totalHistoryCount / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const { id, action } = req.params;
    const { quantity } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (action === "add") {
      product.quantity += quantity;
    } else if (action === "remove") {
      product.quantity -= quantity;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await product.save();

    // Create a history record
    const history = new History({
      productId: product._id,
      quantityChanged: quantity,
      action: action,
    });

    await history.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific product by ID with paginated history
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch history of the product
    const history = await History.find({ productId: req.params.id });
    res.json({ product, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHistoryByProductId = async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const history = await History.find({ product: productId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalHistoryCount = await History.countDocuments({
      product: productId,
    });

    res.json({ history, totalPages: Math.ceil(totalHistoryCount / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
