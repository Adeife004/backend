const mongoose = require("mongoose");

// product schema
const ProductSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_date: { type: String, default: Date.now() },
})

const ProductModel = mongoose.model("Product", ProductSchema, "Product");

module.exports = ProductModel