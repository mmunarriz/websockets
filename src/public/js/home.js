async function fetchProducts() {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    try {
        const response = await fetch("http://localhost:8080/api/products", requestOptions);
        const data = await response.json();
        const productosElement = document.getElementById('products');

        // Limpiar contenido previo
        productosElement.innerHTML = '';

        // Actualizar el contenido con los datos obtenidos
        const formattedData = JSON.stringify(data, null, 4); // Indentacion de 4 spacios
        const preElement = document.createElement('pre'); // Preservar la estructura de formato JSON
        preElement.textContent = formattedData;
        productosElement.appendChild(preElement);
    } catch (error) {
        console.log('error', error);
    }
}

fetchProducts();


