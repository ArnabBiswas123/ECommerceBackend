require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../model/Product');

const stripePayment = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, msg: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, msg: 'Product not found' });
    }

  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: {
        productId: product._id.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });
    return res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('Stripe payment error:', error);
    return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};

module.exports = stripePayment;