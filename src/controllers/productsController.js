const Product = require('../models/Product');

// Función auxiliar para obtener los productos con filtros y paginación
const getFilteredProducts = async ({ limit, page, sort, query }) => {
  const filter = query ? { category: query } : {};
  const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

  const limitNum = parseInt(limit, 10) || 10;
  const pageNum = parseInt(page, 10) || 1;

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limitNum);

  return { products, totalPages, pageNum, limitNum };
};

// Obtener productos con paginación, filtros y ordenamiento
const getProducts = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const { products, totalPages, pageNum } = await getFilteredProducts({ limit, page, sort, query });

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: pageNum > 1 ? pageNum - 1 : null,
      nextPage: pageNum < totalPages ? pageNum + 1 : null,
      page: pageNum,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
      prevLink: pageNum > 1 ? `/api/products?limit=${limit}&page=${pageNum - 1}&sort=${sort}&query=${query}` : null,
      nextLink: pageNum < totalPages ? `/api/products?limit=${limit}&page=${pageNum + 1}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Obtener un producto por su ID y renderizar la vista de detalles
const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('productDetails', { product: product.toObject() });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al cargar el producto');
    }
};
// Agregar un nuevo producto
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el producto' });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Generar 20 productos de prueba
const generateTestProducts = async (req, res) => {
  try {
    const testProducts = Array.from({ length: 20 }, (_, i) => ({
      title: `Producto ${i + 1}`,
      description: `Descripción del Producto ${i + 1}`,
      code: `CODE${i + 1}`,
      price: Math.floor(Math.random() * 1000) + 1,
      status: true,
      stock: Math.floor(Math.random() * 100) + 1,
      category: `Categoría ${['A', 'B', 'C'][i % 3]}`,
      thumbnails: []
    }));

    await Product.insertMany(testProducts);
    res.json({ message: "200 productos de prueba generados exitosamente" });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar productos de prueba' });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "Todos los productos fueron eliminados exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar todos los productos" });
  }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    generateTestProducts,
    deleteAllProducts
};
