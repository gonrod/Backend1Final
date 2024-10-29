# Backend 1 - PreEntrega 1

## Descripción del Proyecto

Este proyecto es la primera entrega para el curso de Backend 1. Se trata de un servidor construido con **Node.js** y **Express**, que gestiona productos y carritos de compras. La información de los productos y carritos se almacena de manera persistente utilizando el sistema de archivos (`products.json` y `carts.json`).

## Funcionalidades

El proyecto contiene dos grupos de rutas:

1. **/api/products**: Para la gestión de productos.
2. **/api/carts**: Para la gestión de carritos de compras.

### Endpoints Disponibles

#### Productos (`/api/products`)

1. **GET /** - Listar todos los productos.
   - `GET /api/products`
   - Parámetro opcional: `?limit` para limitar el número de productos retornados.

2. **GET /:pid** - Obtener un producto específico por su ID.
   - `GET /api/products/:pid`

3. **POST /** - Agregar un nuevo producto.
   - `POST /api/products`
   - **Body**: Debe incluir los campos `title`, `description`, `code`, `price`, `stock`, `category`, y opcionalmente `thumbnails`.

4. **PUT /:pid** - Actualizar un producto específico.
   - `PUT /api/products/:pid`
   - **Body**: Debe incluir los campos a actualizar, excepto `id`.

5. **DELETE /:pid** - Eliminar un producto específico.
   - `DELETE /api/products/:pid`

#### Carritos (`/api/carts`)

1. **POST /** - Crear un nuevo carrito.
   - `POST /api/carts`

2. **GET /:cid** - Obtener un carrito específico por su ID.
   - `GET /api/carts/:cid`

3. **POST /:cid/product/:pid** - Agregar un producto a un carrito específico.
   - `POST /api/carts/:cid/product/:pid`
   - **Descripción**: Añade el producto con el `id` especificado al carrito. Si el producto ya está en el carrito, incrementa la cantidad.

4. **DELETE /:cid/product/:pid** - Eliminar un producto de un carrito específico.
   - `DELETE /api/carts/:cid/product/:pid`

