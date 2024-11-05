import { Router } from 'express'
import { createProduct, deleteProduct, getProductByID, getProducts, updateAvailability, updateProduct } from './handlers/produc'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'

const router = Router()


/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The Product name
 *                      example: Tablet Samsung S9
 *                  price:
 *                      type: number
 *                      description: The Product price
 *                      example: 800
 *                  availability:
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true
 */

// Routing -> el navegador solo soporte el get y post como verbos de http
// la ruta es valor de la URL, es decir que si por ejemplo en el server lo defino como /api -> la URL es /api/{nombreDeAca}

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200: 
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 */


router.get('/', getProducts)


/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by id
 *      tags:
 *          - Products
 *      description: Return a product based on it's unique ID
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 * 
 *      responses:
 *          200:
 *              description: Succesful Response
 *              content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *          404:
 *              description: Product not found
 * 
 *          400:
 *              description: Bad request, invalid ID
 */

router.get('/:id', 

    param('id').isInt().withMessage('ID no válido'), // es como el body o el check de antes pero para parametros
    handleInputErrors,
    getProductByID
)

// usar body para cuando son sincronicas
// usar check cuando son asincronas

/**
 * @swagger
 * /api/products/:
 *  post:
 *      summary: Creates a new product
 *      tags: 
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          requierd: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          name: 
 *                              type: string
 *                              example: "Tablet Samsung S9"
 *                          price: 
 *                              type: number
 *                              example: 800
 *      responses:
 *          201:
 *              description: Succesful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - invalid input data
 */
router.post('/', 
    // Validación de datos -> los metodos se puede anidar y el run es para que recupere lo que mandamos al server
    
    body('name')
        .notEmpty().withMessage('El nombre del Producto no puede ir vacio'),

    body('price')
        .isNumeric().withMessage('El dato ingresado debe ser un número')
        .notEmpty().withMessage('El precio del Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido, debe ser mayor a 0'), // una validación customizada

    handleInputErrors, // -> middleware
    
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags: 
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          requierd: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          name: 
 *                              type: string
 *                              example: "Tablet Samsung S9 - Actualizado"
 *                          price: 
 *                              type: number
 *                              example: 800
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Succesful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalidad ID or Invalidad input data
 *          404:
 *              description: Product not found
 */
router.put('/:id', 
    param('id').isInt().withMessage('ID no válido'),

    body('name')
        .notEmpty().withMessage('El nombre del Producto no puede ir vacio'),

    body('price')
        .isNumeric().withMessage('El dato ingresado debe ser un número')
        .notEmpty().withMessage('El precio del Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido, debe ser mayor a 0'),

    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'),

    handleInputErrors, 

    updateProduct
)


/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalidad ID or Invalidad input data
 *          404:
 *              description: Product not found
 */
router.patch('/:id', 
    
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updateAvailability
)


/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete an existent Product
 *      tags:
 *          - Products
 *      description: Deletes a product by a given ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Returns a confirmation message
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto Eliminado'
 *                          
 *          400:
 *              description: Bad Request - Invalidad ID or Invalidad input data
 *          404:
 *              description: Product not found
 *          
 */
router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct
)

export default router