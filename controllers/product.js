const Product = require('../model/Product');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};
const addProduct = async (req, res) => {
  try {
    const { name, price, description, countInStock } = req.body;

   
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ success: false, msg: 'Product name is required and must be a non-empty string' });
    }
    if (price == null || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ success: false, msg: 'Product price is required and must be a non-negative number' });
    }
    if (countInStock != null && (isNaN(countInStock) || Number(countInStock) < 0)) {
      return res.status(400).json({ success: false, msg: 'countInStock, if provided, must be a non-negative number' });
    }

    let imageUrl = '';
    if (req.file) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'products'
      });
      imageUrl = result.secure_url;
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      description: description ? description.trim() : '',
      imageUrl,
      countInStock: countInStock != null ? Number(countInStock) : 0,
    });

    const createdProduct = await product.save();
    return res.status(201).json({ success: true, createdProduct });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "internal server error is there" })
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "internal server error is there" })
  }
};
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({ countInStock: { $gt: 0 } });;
    return res.json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "internal server error is there" })
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, msg: 'Product not found' });
    }


    if (req.file) {
      await deleteFromCloudinary(product.publicId);
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder: 'products' });
      product.imageUrl = result.secure_url;
      product.publicId = result.public_id;
    }


    if (name != null) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Product name must be a non-empty string' });
      }
      product.name = name.trim();
    }
    if (price != null) {
      if (isNaN(price) || Number(price) < 0) {
        return res.status(400).json({ success: false, msg: 'Product price must be a non-negative number' });
      }
      product.price = Number(price);
    }
    if (description != null) {
      if (typeof description !== 'string') {
        return res.status(400).json({ success: false, msg: 'Description must be a string' });
      }
      product.description = description.trim();
    }
    if (countInStock != null) {
      if (isNaN(countInStock) || Number(countInStock) < 0) {
        return res.status(400).json({ success: false, msg: 'countInStock must be a non-negative number' });
      }
      product.countInStock = Number(countInStock);
    }

    const updatedProduct = await product.save();
    return res.json({ success: true, updatedProduct });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "internal server error is there" })
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, msg: 'Product not found' });
    }


    await deleteFromCloudinary(product.publicId);

    await product.deleteOne();
    return res.json({ success: true, msg: 'Product removed successfully' });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "internal server error is there" })
  }
};

module.exports = {
  addProduct,
  getAllProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
