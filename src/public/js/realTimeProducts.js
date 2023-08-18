const socket = io();
const productosElement = document.getElementById('products');

socket.on('log', data => {
    // Limpiar contenido previo
    productosElement.innerHTML = '';

    // Actualizar el contenido con los datos obtenidos
    const formattedData = JSON.stringify(data, null, 4); // Indentacion de 4 spacios
    const preElement = document.createElement('pre'); // Preservar la estructura de formato JSON
    preElement.textContent = formattedData;
    productosElement.appendChild(preElement);
})