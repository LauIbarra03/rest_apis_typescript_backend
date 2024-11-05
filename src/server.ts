import express from 'express';
import productsRouter from './router';
import db from './config/db';
import colors from 'colors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUIOptions } from './config/swagger';
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'

// Conectar a la BD
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.blue("Conectado exitosamente"))
    } catch (e) {
        console.log(colors.red('Hubo un error al conectar a la BD'))
    }
}

connectDB()

// Intancia de express
const server = express()

// Permitir conexiones con CORS -> solo permito las conexiones de ciertos dominios en especifico
const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true) // Permitir la conexion
        } else{
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))
// Leer datos de formularios -> habilita la lectura de JSON
server.use(express.json())

// Morgan -> sirve para el logging y debugging y tener los datos de los llamados al server
server.use(morgan('dev'))

// el metodo use engloba todos los metodos Http, se ejecuta en cada una de las rutas del router
// esta es la ruta base -> defino los endpoints
server.use('/api/products', productsRouter)
// server.use('/api/services', serviceRouter) // Puedo tener varios routers distintos

// server.get('/api', (req, res) => {
//     res.json({ msg: 'desde API' })
// })

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUIOptions))

export default server