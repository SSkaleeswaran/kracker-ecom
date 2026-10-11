import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { addCartItem, getCart, getWishlist, toggleWishlist } from '../services/shopService';
import { errMsg } from '../utils';

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]); // product ids
  const [toast, setToast] = useState('');

  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  useEffect(() => {
    if (user && user.role === 'user') {
      getCart().then((r) => setCart(r.data.items)).catch(() => {});
      getWishlist().then((r) => setWish(r.data.products.map((p) => p._id))).catch(() => {});
    } else { setCart([]); setWish([]); }
  }, [user]);

  const needLogin = () => {
    if (!user) { notify('Log in to continue'); navigate('/login'); return true; }
    if (user.role === 'admin') { notify('Admins cannot shop. Use a customer account.'); return true; }
    return false;
  };

  const addToCart = async (productId, qty = 1) => {
    if (needLogin()) return;
    try {
      const res = await addCartItem(productId, qty);
      setCart(res.data.items);
      notify('Added to cart');
    } catch (e) { notify(errMsg(e)); }
  };

  const toggleWish = async (productId) => {
    if (needLogin()) return;
    try {
      const res = await toggleWishlist(productId);
      setWish(res.data.products.map((p) => p._id));
    } catch (e) { notify(errMsg(e)); }
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <ShopContext.Provider value={{ cart, setCart, wish, setWish, cartCount, addToCart, toggleWish, notify }}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </ShopContext.Provider>
  );
}
