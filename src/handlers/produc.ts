import { Request, Response } from "express"
import Product from '../models/Product.model';

// Este handler es como un controller, solamente se tiene que encargar de delegar a donde corresponda, gestionar respuestas y recibir la solicitud
// por eso mueve la lógica de validación al router

export const getProducts = async (req: Request, res: Response) => {

    const products = await Product.findAll({
        order: [
            ['id', 'ASC'] // UN ORDERBY
        ],
        // limit: 2 // un LIMIT
        attributes: { exclude: ['updatedAt', 'createdAt'] } // es para excluir datos del select
    })
    res.json({ data: products })

    // El catch no se ejecutaba nunca, lo comento para que quede, pero esto me sube las métricas del coverage
    // y lo comento pq ahora no lo necesito y es poco probable que no se pueda conectar a la base
    // eso dice el instructor del curso, pero yo lo dejaría y haría algún test para ver q funcione bien
    // se puede justificar que ya hay validación desde la URL, pero si se puede tener más capas de seguridad mejor creo yo
    // try {
    //     const products = await Product.findAll({
    //         order: [
    //             ['id', 'ASC'] // UN ORDERBY
    //         ],
    //         // limit: 2 // un LIMIT
    //         attributes: { exclude: ['updatedAt', 'createdAt', 'availability'] } // es para excluir datos del select
    //     })
    //     res.json({ data: products })
    // } catch(e) {
    //     console.log(e)
    // }
}

export const createProduct = async (req: Request, res: Response) => {
    
    const product = await Product.create(req.body)
    res.status(201).json({data: product})
  
}

export const getProductByID = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByPk(req.params.id)

        if (!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        res.json({data: product})
    } catch (e) {
        console.log(e)
    }
    
}

// PUT -> ACTUALIZAR COMPLETAMENTE
// Función para el put, este tiene que actualizar todo
// PUt reemplaza TODO con lo que le mandes
// put se usa para actualizar o reemplazar COMPLETAMENTE un recurso existente en un servidor web
// toma la info proporcionada y esa info la usa para reemplazar completamente el recurso en la ubicacion especifica
// por ejemplo si le mando un objeto json que es un producto y hago una solicitud put al server con ese objetos, el server reemplazará completamente 
// los datos del producto existente con los datos proporcionados en la solicitud
// es decir, que si yo mando como dato que solo cambie la disponibilidad, me sobrescribe todo el objeto, borrando lo anterior y solo queda la disponibilidad
export const updateProduct = async (req: Request, res: Response) => {
    try {

        // Valido que exista
        const product = await Product.findByPk(req.params.id)

        if (!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        // Actualizar
        await product.update(req.body) // actualiza con todo lo que le pase acá -> el update si solo le paso un campo entonces solo actualiza ese campo
        await product.save() // dsp lo tengo que guardar
        res.json({data: product})
    } catch (e) {
        console.log(e)
    }
    
}

// PATCH -> MODIFICAR PARCIALMENTE
// Funcion para patch
// reemplaza unicamente lo que le estoy enviando
// patch es para realizar modificaciones parciales en un recursos existente en un servidor web
// hago cambios especificos sin afectar al resto de la informacion
// por ejemplo mando un json que solo cambia la disponibilidad, solo cambiaria eso sin tocas los otros atributos 
export const updateAvailability = async(req: Request, res: Response) => {
    try {

        // Valido que exista
        const product = await Product.findByPk(req.params.id)

        if (!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        // Actualizar -> un ejemplo con datos que llegan desde el body
        // product.availability = req.body.availability
        // await product.save() // dsp lo tengo que guardar
        
        product.availability = !product.dataValues.availability
        await product.save()

        res.json({data: product})
    } catch (e) {
        console.log(e)
    }
    
}

export const deleteProduct = async(req: Request, res: Response) => {
    try {

        const product = await Product.findByPk(req.params.id)

        if (!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        await product.destroy() // este destroy es un eliminación física
        // para el lógico solo tengo que cambiar el valor de active a un 0 y dsp para todas las busquedas para traer los datos lo tengo que setear para que me traiga los activos
        res.json({ data: 'Producto Eliminado' })
        
    } catch (e) {
        console.log(e)
    }
    
}