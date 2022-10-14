const express = require('express');
const productos = require('./routes/productos')
const productosNoRest = require('./routes/productosNoRest')
const app = express()
const PORT = 8080

app.use('/static', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(async function (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send('Something broke!')
})


app.set('view engine', 'pug')
app.set('views', './views')

const server = app.listen(PORT, async () => {
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`)
    await productos.InicializarProductos()
})

server.on('error', error => console.log(`Error en servidor ${error}`))

// app.use(express.static('public'))
app.use('/productos', productos.router)
app.use('/', productosNoRest.router)
