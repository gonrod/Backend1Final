const express = require('express');
const { createCart, getCartById, addProductToCart, removeProductFromCart } = require('../controllers/cartsController');

const router = express.Router();

// Otras rutas
router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);

// Ruta para eliminar un producto de un carrito específico
router.delete('/:cid/product/:pid', removeProductFromCart);

module.exports = router;
