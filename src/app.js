const express = require('express');
const cors = require('cors');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { Server } = require('socket.io');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

const app = express();
const PORT = 8080;

// Crear servidor HTTP para usar con Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middleware para habilitar CORS
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Registrar los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Leer productos desde products.json
let products = [];

fs.readFile(path.join(__dirname, '../data/products.json'), 'utf-8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo products.json:', err);
        return;
    }
    products = JSON.parse(data);
});

// Ruta para la vista principal de productos
app.get('/products', (req, res) => {
    res.render('index', { products }); // Mostrar los productos desde el archivo
});

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// Lógica de WebSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Emitir lista de productos al cliente cuando se conecte
    socket.emit('productList', products);

    // Escuchar eventos de agregar productos
    socket.on('newProduct', (product) => {
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1, // Generar ID único
            ...product
        };
        products.push(newProduct);
        io.emit('productList', products); // Emitir la lista actualizada a todos los clientes

        // Guardar los cambios en el archivo products.json
        fs.writeFile(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar el producto en products.json:', err);
            }
        });
    });

    // Escuchar eventos de eliminación de productos
    socket.on('deleteProduct', (productId) => {
        products = products.filter(p => p.id !== productId);
        io.emit('productList', products); // Emitir la lista actualizada a todos los clientes

        // Guardar los cambios en el archivo products.json
        fs.writeFile(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error al eliminar el producto en products.json:', err);
            }
        });
    });
});

// Iniciar el servidor con Socket.IO
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
