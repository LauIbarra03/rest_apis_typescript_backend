import server from "./server";
import colors from 'colors';


// Defino en que puerto lo incializo
// el puerto no lo defino yo, me lo da una variable de entorno que siempre se define así, pero tambien le puedo indicar yo la otra opcion para laburar de forma local
const port = process.env.PORT  || 4000
server.listen(port, () => {
    console.log(colors.cyan.bold(`REST API EN EL PUERTO ${port}`))
})