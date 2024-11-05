import request from 'supertest'
import server from '../../server';

describe('POST /api/products', () => {
    it('Shoul display validations errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(200)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('Shoul display validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor',
            price: -200
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(200)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('Shoul display validate that the price a number and is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor',
            price: "asd"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(200)
        expect(response.body.errors).not.toHaveLength(3)
    })

    it('Should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse-testing",
            price: 50
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
        
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products', () => {

    it('Shoul check if the URL exits', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    it('GET a JSON respons with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
        
    })
})


describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')
    })

    it("Should check a valid ID in the URL", async () => {
        const response = await request(server).get('/api/products/not_valid_id')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it("Should get a JSON response for a single product", async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})



describe('PUT /api/products/:id', () => {

    it("Should check a valid ID in the URL", async () => {
        const response = await request(server).put('/api/products/not_valid_id').send({
            name:"Tablet Samsung S9",
            price: 900,
            availability: true
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('Should display validation error message when updating a product' , async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should validate that the price is greater than 0' , async () => {
        const response = await request(server).put('/api/products/1').send({
            name:"Tablet Samsung S9 - Actualizado",
            price: -900,
            availability: true
          })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Precio no válido, debe ser mayor a 0")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should return a 404 for an non-existent product' , async () => {
        const productID = 1146341
        const response = await request(server).put(`/api/products/${productID}`).send({
            name:"Tablet Samsung S9 - Actualizado",
            price: 900,
            availability: true
          })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')


        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update an existent product with validate data' , async () => {
        const productID = 1
        const response = await request(server).put(`/api/products/${productID}`).send({
            name:"Tablet Samsung S9 - Actualizado",
            price: 900,
            availability: true
          })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')


        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('erros')
    })
})

describe("PATCH  /api/products/:id", () => {
    it('Should return a 404 for an non-existent product' , async () => {
        const productID = 1146341
        const response = await request(server).patch(`/api/products/${productID}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should change the product availability', async () => {
        const productID = 1
        const response = await request(server).patch(`/api/products/${productID}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)
        

        expect(response.status).not.toBe(404)
        expect(response.body.error).not.toBe('Producto no encontrado')

    })
})

describe("DELETE /api/products/:id", () => {
    it("Shoul check a valid id", async () => {
        const response = await request(server).delete('/api/products/not_valid_id')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')
    })

    it('Shoul delete a product', async () => {
        const productId = 1
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(404)
    })
})

