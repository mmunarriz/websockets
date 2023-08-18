# Websockets y Handlebars:

Configurar nuestro proyecto para que trabaje con Handlebars y Websockets.
Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.

# (*) LAS NUEVAS FUNCIONALIDADES SE ENCUENTRAN AL FINAL DE ESTE README

## Instrucciones:

Instalar dependencias: npm i

Ejecutar: npm start

## Ejemplos (products):

Listar productos:

GET http://localhost:8080/api/products

Listar productos (con limit):

GET http://localhost:8080/api/products?limit=3

Listar un producto específico:

GET http://localhost:8080/api/products/5

Agregar un producto:

POST http://localhost:8080/api/products

        Body ejemplo:
            {
                "title": "producto",
                "description": "descripcion del producto",
                "category": "cat1",
                "price": 200,
                "code": "abc102",
                "stock": 10,
                "thumbnails": ["img1.jpg", "img2.jpg", "img3.jpg"]
            }

Actualizar un producto específico:

PUT http://localhost:8080/api/products/3

        Body ejemplo:
            {
                "title": "producto",
                "description": "descripcion del producto",
                "category": "cat1",
                "price": 100,
                "code": "abc104",
                "stock": 10,
                "thumbnails": ["img1.jpg", "img2.jpg", "img3.jpg"]
            }

Eliminar un producto:

DELETE http://localhost:8080/api/products/4

## Ejemplos (carts):

Crear un nuevo carrito:

POST http://localhost:8080/api/carts

Listar los productos de un carrito específico:

GET http://localhost:8080/api/carts/2

Agregar producto a un carrito:

POST http://localhost:8080/api/carts/2/product/7

        Body ejemplo:
            {
                "quantity": 8
            }

# (*) NUEVAS FUNCIONALIDADES:

## Vista "home.handlebars":

Contiene una lista de todos los productos agregados hasta el momento.

GET http://localhost:8080/views/

## Vista "realTimeProducts.handlebars":

Contiene la misma lista de productos, sin embargo, ésta trabaja con websockets.
Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se actualiza automáticamente en dicha vista la lista.

GET http://localhost:8080/views/realtimeproducts
