require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../model/Product');
const Order = require('../model/Order');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeWebhookController = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

 
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const productId = session.metadata.productId;
      const customerEmail = session.customer_details.email;
      const totalAmount = session.amount_total / 100;

     
      await Product.findByIdAndUpdate(productId, { $inc: { quantity: -1 } });

     
      const order = new Order({
        email: customerEmail,
        products: [{ product: productId, quantity: 1 }],
        amount: totalAmount,
        paymentStatus: 'paid',
      });

      await order.save();
      console.log(`✅ Order saved for ${customerEmail}`);
    } catch (error) {
      console.error('❌ Error saving order or updating product:', error);
    }
  }

  // Acknowledge receipt
  res.json({ received: true });
};

module.exports = stripeWebhookController;