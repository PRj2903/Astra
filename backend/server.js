import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Astrra Jewellery REST API running.' });
});

// 1. GET /api/products (supports category and search query)
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ message: 'Product not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /api/orders (Processes order, calculates totals securely, saves order + items)
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer) {
      return res.status(400).json({ message: 'Customer details are required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    // Server-side price recalculation from database
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.productId)
        .single();

      if (error || !product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      totalAmount += Number(product.price) * item.quantity;
      verifiedItems.push({
        product_id: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    const orderNumber = `AST-${Date.now().toString().slice(-6)}`;

    // Create Order Record (prepared for Razorpay/Stripe)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customer.fullName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: customer.address,
        city: customer.city,
        postal_code: customer.postalCode,
        total_amount: totalAmount,
        payment_status: 'PAID', // Simulated immediate confirmation
        payment_provider: 'MOCK_GATEWAY',
        transaction_id: `TXN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Attach order_id to each item
    const orderItemsWithId = verifiedItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithId);

    if (itemsError) throw itemsError;

    res.status(201).json({
      ...order,
      items: orderItemsWithId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET /api/orders/:id (Retrieve order with items for confirmation page)
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .single();

    if (orderError || !order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
}

export default app;