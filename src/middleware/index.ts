// middleware, un software intermedio que procesa las solicitudes http antes de que llegue el enrutamiento principal
// se ejecutan en el medio del flujo de solicitud y respuesta de una aplicacion web -> se ejecuta entre una acción y otra
// puede autenticar, validar datos, registrar solicitudes, compresion de repuestas, etc

import { validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return 
    }

    next() // es como un push -> la avisa al otro que ya termino
}

