const Cart = require('../models/Cart');

// Función auxiliar para encontrar un carrito
const findCartById = async (id, res) => {
  const cart = await Cart.findById(id).populate('products.product');
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }
  return cart;
};

// Crear un nuevo carrito
const createCart = async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
};

// Obtener un carrito por su ID
const getCartById = async (req, res) => {
  try {
    const cart = await findCartById(req.params.cid, res);
    if (cart) res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Agregar un producto a un carrito
const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await findCartById(cid, res);
    if (!cart) return;

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

// Eliminar un producto de un carrito
const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await findCartById(cid, res);
    if (!cart) return;

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart
};
