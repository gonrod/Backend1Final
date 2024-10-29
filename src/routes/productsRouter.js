const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../../data/products.json');

// Obtener todos los productos
router.get('/', (req, res) => {
    fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de productos' });
        }
        const products = JSON.parse(data);
        res.json(products);
    });
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
    fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de productos' });
        }
        const products = JSON.parse(data);
        const product = products.find(p => p.id === parseInt(req.params.pid));
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    });
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de productos' });
        }

        const products = JSON.parse(data);
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || []
        };

        products.push(newProduct);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el producto' });
            }
            res.status(201).json(newProduct);
        });
    });
});

module.exports = router;
