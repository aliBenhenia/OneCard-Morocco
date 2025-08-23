const Product = require('../models/Product');

// AUTO-SEED SAMPLE PRODUCTS
async function autoSeedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: "Amazon Gift Card",
        description: "Digital gift card",
        price: 50,
        imageUrl: "/images/amazon-gift-card.png"
      },
      {
        name: "Netflix Gift Card",
        description: "Enjoy Netflix subscription",
        price: 25,
        imageUrl: "/images/netflix.png"
      }
    ]);
    console.log("✅ Sample products seeded");
  }
}

// GET ALL PRODUCTS
async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { autoSeedProducts, getAllProducts };
