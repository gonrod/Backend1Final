const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join(__dirname, '../../data/carts.json');

// Crear un nuevo carrito
const createCart = (req, res) => {
    fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read carts file' });
        }
        let carts = JSON.parse(data);
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);

        fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create cart' });
            }
            res.status(201).json(newCart);
        });
    });
};

// Obtener un carrito por su ID
const getCartById = (req, res) => {
    fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read carts file' });
        }
        const carts = JSON.parse(data);
        const cart = carts.find(c => c.id === parseInt(req.params.cid));
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
    });
};

// Agregar un producto a un carrito
const addProductToCart = (req, res) => {
    const { cid, pid } = req.params;

    fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read carts file' });
        }
        let carts = JSON.parse(data);
        const cart = carts.find(c => c.id === parseInt(cid));

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.product === parseInt(pid));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: parseInt(pid), quantity: 1 });
        }

        fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update cart' });
            }
            res.status(201).json(cart);
        });
    });
};

// Eliminar un producto de un carrito
const removeProductFromCart = (req, res) => {
    const { cid, pid } = req.params;

    fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read carts file' });
        }
        let carts = JSON.parse(data);
        const cart = carts.find(c => c.id === parseInt(cid));

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.product === parseInt(pid));

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Eliminar el producto del carrito
        cart.products.splice(productIndex, 1);

        fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update cart' });
            }
            res.status(204).send(); // No Content
        });
    });
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart
};
