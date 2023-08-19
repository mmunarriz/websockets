async function fetchProducts() {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    try {
        const response = await fetch("http://localhost:8080/api/products", requestOptions);
        const data = await response.json();
        const products = document.getElementById('firstTimeProducts');

        // Limpiar contenido previo
        products.innerHTML = '';

        // Construir la tabla con los datos de los productos
        data.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.code}</td>
                <td>${product.stock}</td>
                <td>${product.id}</td>
                <td>${product.status ? 'Active' : 'Inactive'}</td>
            `;
            products.appendChild(row);
        });
    } catch (error) {
        console.log('error', error);
    }
}

fetchProducts();


const socket = io();
const productsElement = document.getElementById('realTimeProducts');
const productsElementPrev = document.getElementById('firstTimeProducts');

socket.on('log', data => {
    // Limpiar contenido previo
    productsElement.innerHTML = '';
    // Limpiar contenido previo
    productsElementPrev.innerHTML = '';

    // Construir la tabla con los datos de los productos
    data.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.code}</td>
                <td>${product.stock}</td>
                <td>${product.id}</td>
                <td>${product.status ? 'Active' : 'Inactive'}</td>
            `;
        productsElement.appendChild(row);
    });
})