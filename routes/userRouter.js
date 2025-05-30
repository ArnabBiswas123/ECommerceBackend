const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
//   limits: { fileSize: 20 * 1024 * 1024 },
});
const { protect } = require('../middleware/tokenUser');
const signup = require('../controllers/signup')
const login = require('../controllers/login')

const { addProduct, updateProduct, deleteProduct, getAllProducts } = require("../controllers/product");
const express = require("express");
const stripePayment = require("../controllers/stripePayment");
// const stripeWebhookController = require("../controllers/stripeWebhookController");
const router = express.Router();
router.post('/signup', signup)
router.post('/login', login)
router.post('/addnewproduct', upload.single('file'),protect, addProduct)
router.put('/updateproduct/:id', upload.single('file'), protect, updateProduct)
router.delete('/deleteproduct/:id', protect, deleteProduct)
router.get('/getallproduct', protect, getAllProducts)
router.get('/getallproducts',  getAllProducts)
router.post('/create-checkout-session',  stripePayment)
// router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookController)


module.exports = router;