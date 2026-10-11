require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Wishlist = require('./models/Wishlist');

const img = (s) => `https://picsum.photos/seed/${s}/600/450`;
// MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
// mongodb+srv://<db_username>:<db_password>@cluster0.2a8uap5.mongodb.net/?appName=Cluster0
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, Category, Product, Cart, Order, Wishlist].map((m) => m.deleteMany({})));

  await User.create([
    { name: 'Admin', email: 'admin@shop.com', password: await bcrypt.hash(' ', 10), address: 'Head Office', role: 'admin' },
    { name: 'Demo User', email: 'user@shop.com', password: await bcrypt.hash('user123', 10), address: '12 Main Street, Coimbatore' },
  ]);

  const cats = await Category.create([{ name: 'Electronics' }, { name: 'Clothing' }, { name: 'Home & Kitchen' }, { name: 'Books' }]);
  const [el, cl, hk, bk] = cats.map((c) => c._id);

  await Product.create([
    { name: 'Wireless Headphones', category: el, price: 59.99, stock: 25, image: img('headphones'), description: 'Over-ear Bluetooth headphones with 30-hour battery life.' },
    { name: 'Smart Watch', category: el, price: 89.5, stock: 15, image: img('watch'), description: 'Fitness tracking, heart-rate monitor and notifications.' },
    { name: 'Bluetooth Speaker', category: el, price: 34.0, stock: 40, image: img('speaker'), description: 'Portable waterproof speaker with deep bass.' },
    { name: 'Cotton T-Shirt', category: cl, price: 14.99, stock: 100, image: img('tshirt'), description: 'Soft 100% cotton crew-neck t-shirt.' },
    { name: 'Denim Jacket', category: cl, price: 49.0, stock: 30, image: img('jacket'), description: 'Classic blue denim jacket, regular fit.' },
    { name: 'Running Shoes', category: cl, price: 64.99, stock: 20, image: img('shoes'), description: 'Lightweight, breathable shoes for daily runs.' },
    { name: 'Ceramic Mug Set', category: hk, price: 19.5, stock: 50, image: img('mugs'), description: 'Set of four 350ml ceramic mugs.' },
    { name: 'Non-stick Frying Pan', category: hk, price: 24.99, stock: 35, image: img('pan'), description: '28cm pan with a durable non-stick coating.' },
    { name: 'Table Lamp', category: hk, price: 27.0, stock: 18, image: img('lamp'), description: 'Warm LED desk lamp with adjustable arm.' },
    { name: 'JavaScript: The Good Parts', category: bk, price: 21.0, stock: 12, image: img('jsbook'), description: 'A concise guide to the best features of JavaScript.' },
    { name: 'Clean Code', category: bk, price: 33.0, stock: 10, image: img('cleancode'), description: 'A handbook of agile software craftsmanship.' },
    { name: 'Notebook Pack (5)', category: bk, price: 9.99, stock: 80, image: img('notebooks'), description: 'Five ruled A5 notebooks.' },
  ]);

  console.log('Seeded. Admin: admin@shop.com / admin123   User: user@shop.com / user123');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
