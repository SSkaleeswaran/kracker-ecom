const router = require('express').Router();
const c = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/', c.getCart);
router.post('/', c.addToCart);
router.put('/:productId', c.updateQty);
router.delete('/:productId', c.removeItem);
module.exports = router;
