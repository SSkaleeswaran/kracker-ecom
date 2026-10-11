const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/', protect, c.placeOrder);
router.get('/my', protect, c.myOrders);
router.get('/', protect, adminOnly, c.allOrders);
router.get('/:id', protect, c.getOrder);
router.put('/:id', protect, adminOnly, c.updateStatus);
module.exports = router;
