const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    generateTestProducts, 
    deleteAllProducts 
} = require('../controllers/productsController');

// Endpoints para productos
router.get('/', getProducts); // Ruta para listar productos con filtros, paginación y ordenamiento
router.get('/:pid', getProductById); // Ruta para ver los detalles de un producto específico
router.post('/', addProduct); // Ruta para agregar un nuevo producto
router.put('/:pid', updateProduct); // Ruta para actualizar un producto existente
router.delete('/:pid', deleteProduct); // Ruta para eliminar un producto específico
router.post('/generate', generateTestProducts); // Ruta para generar productos de prueba
router.delete('/deleteAll', deleteAllProducts); // Ruta para eliminar todos los productos

module.exports = router;
