const express = require('express');
const { getAllProducts , getProductInfo} = require('../controllers/productController');
const { get } = require('mongoose');
const router = express.Router();

router.get('/', getAllProducts);
router.post("/product", getProductInfo);
module.exports = { router };
