import express from "express";
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRoute from './routes/views.js'
import { Server } from "socket.io";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.send(`Servidor ON`);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRoute);

const server = app.listen(8080, () => {
  console.log('Servidor en puerto 8080')
})

const socketServer = new Server(server);

export const emitProductEvent = (products) => {
  socketServer.emit('log', products);
};

socketServer.on('connection', socket => {
  console.log('Nuevo cliente conectado');
})
