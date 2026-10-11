import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageOrders from './pages/admin/ManageOrders';

const userOnly = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

function App() {
  const inAdmin = useLocation().pathname.startsWith('/admin');
  return (
    <>
      {!inAdmin && <Navbar />}
      <main className={inAdmin ? '' : 'container'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={userOnly(<Cart />)} />
          <Route path="/wishlist" element={userOnly(<Wishlist />)} />
          <Route path="/checkout" element={userOnly(<Checkout />)} />
          <Route path="/orders" element={userOnly(<MyOrders />)} />
          <Route path="/profile" element={userOnly(<Profile />)} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>
          <Route path="*" element={<div className="empty"><h2>Page not found</h2></div>} />
        </Routes>
      </main>
      {!inAdmin && <Footer />}
    </>
  );
}

export default App;
