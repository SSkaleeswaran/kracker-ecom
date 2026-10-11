import api from './api';

// auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const updateProfile = (data) => api.put('/auth/profile', data);

// cart
export const getCart = () => api.get('/cart');
export const addCartItem = (productId, qty = 1) => api.post('/cart', { productId, qty });
export const updateCartItem = (productId, qty) => api.put(`/cart/${productId}`, { qty });
export const removeCartItem = (productId) => api.delete(`/cart/${productId}`);

// wishlist
export const getWishlist = () => api.get('/wishlist');
export const toggleWishlist = (productId) => api.post(`/wishlist/${productId}`);

// orders
export const placeOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my');
export const getAllOrders = () => api.get('/orders');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status });

// admin
export const getStats = () => api.get('/admin/stats');
