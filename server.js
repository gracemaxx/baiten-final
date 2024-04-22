const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const data = require('./data');
const multer = require('multer');
const fs = require('fs');



dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = mongoose.model(
  'products',
  new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    price: Number,
    calorie: Number,
    category: String,
    stock: Number,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

app.get('/api/categories', (req, res) => res.send(data.categories));


app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  const products = await Product.find(category ? { category } : {});
  res.send(products);
});

app.get('/api/products/seed', async (req, res) => {
  const products = await Product.insertMany(data.products);
  res.send({ products });
});

app.post('/api/products', upload.single('imageFile'), async (req, res) => {
  const { name, price, calorie, category, stock, imageUrl } = req.body;
  let image = imageUrl;  


  if (req.file) {
      image = req.file.path; 
  }

  try {
      const newProduct = new Product({
          name,
          price,
          calorie,
          category,
          stock,
          image  
      });
      await newProduct.save();
      res.send(newProduct);
  } catch (error) {
      console.error('Failed to add product:', error);
      res.status(500).send({ message: 'Failed to add product' });
  }
});




app.delete('/api/products/:id', async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deletedProduct);
});

const Order = mongoose.model(
  'order',
  new mongoose.Schema(
    {
      number: { type: Number, default: 0 },
      lastNumberResetDate: { type: String, default: () => new Date().toISOString().slice(0, 10) }, // YYYY-MM-DD format
      orderType: String,
      paymentType: String,
      isPaid: { type: Boolean, default: false },
      isReady: { type: Boolean, default: false },
      inProgress: { type: Boolean, default: true },
      isCanceled: { type: Boolean, default: false },
      isDelivered: { type: Boolean, default: false },
      totalPrice: Number,
      taxPrice: Number,
      orderItems: [
        {
          name: String,
          price: Number,
          quantity: Number,
          sugarLevel: Number,
        },
      ],
    },
    {
      timestamps: true,
    }
  )
);

app.post('/api/orders', async (req, res) => {
  const lastOrder = await Order.find().sort({ number: -1 }).limit(1);
  const lastNumber = lastOrder.length === 0 ? 0 : lastOrder[0].number;
  
  if (
    !req.body.orderType ||
    !req.body.paymentType ||
    !req.body.orderItems ||
    req.body.orderItems.length === 0
  ) {
    return res.send({ message: 'Data is required.' });
  }
  const order = await Order({ ...req.body, number: lastNumber + 1 }).save();
  res.send(order);
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find({ isDelivered: false, isCanceled: false });
  res.send(orders);
});

app.put('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    if (req.body.action === 'ready') {
      order.isReady = true;
      order.inProgress = false;
    } else if (req.body.action === 'deliver') {
      order.isDelivered = true;
    } else if (req.body.action === 'cancel') {
      order.isCanceled = true;
    }
    await order.save();
    res.send({ message: 'Done' });
  } else {
    req.status(404).message('Order not found');
  }
});
app.get('/api/orders/queue', async (req, res) => {
  const inProgressOrders = await Order.find(
    { inProgress: true, isCanceled: false },
    'number'
  );
  const servingOrders = await Order.find(
    { isReady: true, isDelivered: false },
    'number'
  );
  res.send({ inProgressOrders, servingOrders });
});
app.delete('/api/orders/:id', async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  res.send(order);
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
      const { stock, price } = req.body;
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).send({ message: 'Product not found' });
      }

      if (stock !== undefined && !isNaN(Number(stock))) {
          product.stock = Number(stock);
      }
      if (price !== undefined && !isNaN(Number(price))) {
          product.price = Number(price);
      }
      if (req.file) {
          product.image = req.file.path; // Update the image path if a new image was uploaded
      }

      await product.save();
      res.send(product);
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send({ message: 'Error updating product: ' + error.message });
  }
});







app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`serve at http://localhost:${port}`));
