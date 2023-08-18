import { Router } from 'express';
import fs from "fs/promises";
import { emitProductAddedEvent } from "../app.js";

const router = Router();

// Listar productos
router.get("/", async (req, res) => {
    try {
        // Leer los datos del archivo JSON
        const data = await fs.readFile("./src/productos.json", "utf8");
        const products = JSON.parse(data);

        // Lee el valor del param "limit" (si existe)
        const limit = req.query.limit;

        // Si se recibió el param "limit", devuelve el número de productos solicitados
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            res.status(200).send(limitedProducts);
        } else {
            // Si no se recibió el param "limit", devuelve todos los productos
            res.status(200).send(products);
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Listar un producto específico
router.get("/:pid", async (req, res) => {
    try {
        // Leer los datos del archivo JSON
        const data = await fs.readFile("./src/productos.json", "utf8");
        const products = JSON.parse(data);

        // Obtener el ID del producto de los parámetros de la ruta
        const pid = parseInt(req.params.pid);

        // Busca el producto en la lista por su "id"
        const producto = products.find((item) => item.id === pid);

        // Si el producto existe lo devuelve, si no devuelve un mensaje de error
        if (producto) {
            res.status(200).send(producto);
        } else {
            res.status(404).send({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Agregar un producto
router.post("/", async (req, res) => {
    try {
        // Leer los datos del archivo JSON
        const data = await fs.readFile("./src/productos.json", "utf8");
        const products = JSON.parse(data);

        // Recibe un objeto JSON con los datos del nuevo producto
        // Verifica que los campos obligatorios esten presentes
        const requiredFields = ["title", "description", "category", "price", "code", "stock"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`El campo '${field}' es obligatorio.`);
            }
        }

        // Verifica si el "code" recibido ya existe en algún producto
        const newProductCode = req.body.code;
        const isCodeExist = products.some(product => product.code === newProductCode);

        if (isCodeExist) {
            throw new Error("Ya existe un producto con el mismo código.");
        }

        // Busca el último id existente y genera el nuevo id
        const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
        const newId = lastProductId + 1;

        // Crear el nuevo objeto del producto
        const newProduct = {
            id: newId,
            status: true,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            code: req.body.code,
            stock: req.body.stock,
        };

        // Verifica si se envió 'thumbnails' (campo no obligatorio), si no se envió asigna un array vacío
        if (!req.body.thumbnails) {
            newProduct.thumbnails = [];
        }

        products.push(newProduct);

        // Guardar los datos en el archivo JSON
        await fs.writeFile("./src/productos.json", JSON.stringify(products, null, 2), "utf8");

        // Llamar a la función en "app.js" para emitir el evento de WebSocket
        emitProductAddedEvent(products);

        res.status(200).send({ message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Actualizar un producto
router.put("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);

        // Leer los datos del archivo JSON
        const data = await fs.readFile("./src/productos.json", "utf8");
        const products = JSON.parse(data);

        // Encontrar el índice del producto en la lista por su "id"
        const index = products.findIndex((item) => item.id === pid);

        if (index === -1) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }

        // Obtener el producto actual
        const existingProduct = products[index];

        // Verificar si el "code" recibido ya existe en otro producto, (excepto el producto actual)
        const codeExists = products.some((product, i) => i !== index && product.code === req.body.code);
        if (codeExists) {
            return res.status(400).send({ error: "El código ya está en uso por otro producto" });
        }

        // Actualizar campos del producto con los valores del body
        const updatedProduct = {
            ...existingProduct,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            status: req.body.status,
            price: req.body.price,
            code: req.body.code,
            stock: req.body.stock,
            thumbnails: req.body.thumbnails
        };

        // Reemplazar el producto existente con el producto actualizado
        products[index] = updatedProduct;

        // Guardar los datos actualizados en el archivo JSON
        await fs.writeFile("./src/productos.json", JSON.stringify(products, null, 2));

        // Llamar a la función en "app.js" para emitir el evento de WebSocket
        emitProductAddedEvent(products);

        res.status(200).send({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);

        // Leer los datos del archivo JSON
        const data = await fs.readFile("./src/productos.json", "utf8");
        const products = JSON.parse(data);

        // Encontrar el índice del producto en la lista por su "id"
        const index = products.findIndex((item) => item.id === pid);

        if (index === -1) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }

        // Eliminar el producto de la lista
        const deletedProduct = products.splice(index, 1)[0];

        // Guardar los datos actualizados en el archivo JSON
        await fs.writeFile("./src/productos.json", JSON.stringify(products, null, 2));

        // Llamar a la función en "app.js" para emitir el evento de WebSocket
        emitProductAddedEvent(products);

        res.status(200).send({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


export default router;