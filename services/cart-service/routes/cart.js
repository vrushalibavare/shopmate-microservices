const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:userId', cartController.getCart);
router.post('/:userId/items', cartController.addToCart);
router.put('/:userId/items/:productId', cartController.updateCartItem);
router.delete('/:userId/items/:productId', cartController.removeFromCart);
router.delete('/:userId', cartController.clearCart);

module.exports = router;