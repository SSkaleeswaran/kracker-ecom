const router = require('express').Router();
const c = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');
router.get('/', protect, c.getWishlist);
router.post('/:productId', protect, c.toggleWishlist);
module.exports = router;
