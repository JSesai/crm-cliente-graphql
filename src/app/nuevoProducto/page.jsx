'use client'
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik'; // Biblioteca para gestionar formularios en React
import * as Yup from 'yup'; // Biblioteca para validación de esquemas
import { gql } from '@apollo/client'; // Biblioteca para trabajar con GraphQL
import { useMutation } from '@apollo/client';
import dictionary, { dictionaryUrls } from '../utils/diccionario';

const idioma = 'es';

// mutation de GraphQL para crear nuevo producto
const NUEVO_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput){
    nuevoProducto(input: $input) {
      nombre
      precio
    }
  }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos{
    obtenerProductos {
      nombre
      id
      precio
      existencia      
      
    }
  }
`;

const mensajeModal = () => {

}
export default function NuevoProducto() {
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data: {nuevoProducto}}){
             //obtener el objeto de cache que vamos a actualizar, leemos el cache y le decimos que query es el que se va actualizar
             const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });
             //! el cache nunca se debe mutar, hay que reescribirlo
             cache.writeQuery({
                 query: OBTENER_PRODUCTOS,
                 data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto] // agregar el cliente al final del arreglo de clientes  
 
                 }
             })
        }
    })
    const router = useRouter(); // Navegar 

    // Validación del formulario con Formik y Yup
    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',

        },
        validationSchema: Yup.object({
            nombre: Yup.string().required(dictionary[idioma].formName),
            existencia: Yup.number().required(dictionary[idioma].forExistence).positive('No se aceptan negativos').integer('Existencia en enteros'),
            precio: Yup.number().required(dictionary[idioma].price).positive('No se aceptan negativos'),

        }),
        onSubmit: async valores => {
            console.log('enviando', valores);
            // enviar los datos del formulario al servidor
            const { nombre, existencia, precio } = valores;
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            precio,
                            existencia,
                        }
                    }
                });
                console.log(data);
                if(data.nuevoProducto){
                    
                    Swal.fire({
                        title: 'Producto' ,
                        text: 'Producto Creado Correctamente!!',
                        icon: "success"
                    });
                    router.push(`${dictionaryUrls.products}`); // Navegar al inicio despues de 3 segundos
                } 
                    // setMensaje(null);

                
            } catch (error) {
                console.log(error);
                // setMensaje(error.message);
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                })
            }
        }
    });

    //
    return (
         <>
         
            {/* Encabezado del formulario */}
            <h2 className='text-center text-gray-800 text-2xl font-bold'>Nuevo Producto</h2>
            {/* Contenedor principal */}
            <div className='flex justify-center mt-5'>
                <div className="w-full max-w-sm">
                    {/* Formulario */}
                    <form action="" onSubmit={formik.handleSubmit} className='bg-white rounded shadow-sm px-8 pt-6 pb-8 mb-4'>
                        {/* Campo de Nombre */}
                        <div className='mb-4'>
                            <label htmlFor="nombre" className='block text-gray-700 text-sm font-bold mb-4'>
                                {dictionary[idioma].name}
                            </label>
                            <input
                                id='nombre'
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="text"
                                placeholder='Ingresa Nombre'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </div>
                        {/* Mensaje de error para el campo de Nombre */}
                        {formik.errors.nombre && formik.touched.nombre && (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>{formik.errors.nombre}</p>
                            </div>
                        )}

                        {/* Campo de existencia */}
                        <div className='mb-4'>
                            <label htmlFor="Existencia" className='block text-gray-700 text-sm font-bold mb-4'>
                                {dictionary[idioma].existence}
                            </label>
                            <input
                                id='existencia'
                                value={formik.values.existencia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="number"
                                placeholder='Ingresa la existencia'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </div>
                        {/* Mensaje de error para el campo de existencia */}
                        {formik.errors.existencia && formik.touched.existencia && (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>{formik.errors.existencia}</p>
                            </div>
                        )}

                        {/* Campo de precio */}
                        <div className='mb-4'>
                            <label htmlFor="precio" className='block text-gray-700 text-sm font-bold mb-4'>
                                Precio
                            </label>
                            <input
                                id='precio'
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="number"
                                placeholder='Ingresa Precio'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </div>
                        {/* Mensaje de error para el campo de empresa */}
                        {formik.errors.precio && formik.touched.precio && (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>{formik.errors.precio}</p>
                            </div>
                        )}
                      
                        {/* Botón de Registro */}
                        <input
                            type="submit"
                            disabled={formik.isSubmitting} // Deshabilitar el botón mientras se esté enviando el formulario
                            value="Registrar Producto"
                            className="bg-gray-500 w-full mt-5 p-2 cursor-pointer text-white uppercase hover:bg-gray-900 "
                        />
                    </form>
                </div>
            </div>
        </>
    )
}
