// Ejemplos de tests básicos
// describe('Primer test', () => {
//     test('Revisar que 1 + 1 = 2', () => {
//         expect(1 + 1).toBe(2)
//     })

//     test('Revisar que 1 + 1 != 3', () => {
//         expect(1 + 1).not.toBe(3)
//     })
// })

import { connectDB } from "../server";
import db from "../config/db";

// describe('GET/api', () => {
//     test('Should send back a JSON response', async () => {
//         const res = await request(server).get('/api')
//         expect(res.status).toBe(200) // -> test para el status de la consulta
//         expect(res.headers['content-type']).toMatch(/json/) // -> test para ver q llegue un json
//         expect(res.body.msg).toBe('desde API') // -> test del contenidos

//         // Por la negativa
//         expect(res.status).not.toBe(404)
//         expect(res.body.msg).not.toBe('desde api')
//     })
// })

// crea un mock en ese archivo
jest.mock("../config/db")

describe('connect DB', () => {
    it('Should handle database connection error', async () => {
        // spyOn crea una función en el mock, le pasamos la bd y el método para que espie su comportamiento
        jest.spyOn(db, 'authenticate') // el espia espera a que se ejecuta db.authenticate
            .mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD')) // -> tira una excepcion para que vaya por el catch, fuerzo la excepcion
        
        const consoloSpy = jest.spyOn(console, 'log') // espiando el log, pq es lo q hace el catch

        await connectDB() // llama la conexion

        expect(consoloSpy).toHaveBeenCalledWith( // me aseguro que un mock haya sido llamado con ciertos argumentos
            expect.stringContaining('Hubo un error al conectar a la BD') // que contenga cierto text
        )
    })
})