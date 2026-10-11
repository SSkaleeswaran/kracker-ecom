const router = require('express').Router();
const { stats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/stats', protect, adminOnly, stats);
module.exports = router;
