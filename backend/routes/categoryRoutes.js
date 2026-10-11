const router = require('express').Router();
const c = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/', protect, adminOnly, c.createCategory);
router.get('/', c.getAllCategories);
router.get('/:id', c.getCategoryById);
router.put('/:id', protect, adminOnly, c.updateCategory);
router.delete('/:id', protect, adminOnly, c.deleteCategory);
module.exports = router;
