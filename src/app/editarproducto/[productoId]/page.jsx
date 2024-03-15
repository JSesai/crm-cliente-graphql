'use client'
import { useRouter } from 'next/navigation';
import * as Yup from 'yup'; // Biblioteca para validación de esquemas
import { gql } from '@apollo/client'; // Biblioteca para trabajar con GraphQL
import { useMutation } from '@apollo/client';
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import dictionary, { dictionaryUrls } from '../../utils/diccionario';

const idioma = 'es';
// mutation de GraphQL para obtener un cliente
const OBTENER_PRODUCTO = gql`
query obtenerProducto($id: ID!){
    obtenerProducto(id: $id) {
      nombre
      precio
      existencia
    }
  }
`;

// mutation de GraphQL para editar un cliente
const EDITAR_PRODUCTO = gql`
mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input){
      id,
      nombre,
      precio,
      existencia
    }
  }
`;

export default function EditarProducto({ params }) {
    // console.log(params.productoId);
    const id = params.productoId;
    const router = useRouter();
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    const [actualizarProducto] = useMutation(EDITAR_PRODUCTO);


    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>

                <div
                    className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
        router.push(`${dictionaryUrls.products}`);
    }

    // Validación del formulario con Formik y Yup
    const schemaVlidation = Yup.object({
        nombre: Yup.string().required(dictionary[idioma].formName),
        existencia: Yup.number().required(dictionary[idioma].forExistence),
        precio: Yup.number().required(dictionary[idioma].price),

    });

    //fn que manda la actualizacion del cliente
    const handleUpdateProduct = async (values) => {
        const { nombre, existencia, precio } = values;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            })
            // console.log(data);
            Swal.fire(
                'Actualizado',
                'Cliente Actualizado Correctamente!!',
                'success'
            )
            router.push(`${dictionaryUrls.products}`); // Navegar al inicio 
        } catch (error) {
            Swal.fire(
                'Actualizado',
                error.message,
                'error'
            )
            console.log(error);
            router.push(`${dictionaryUrls.products}`);
        }

    }
    return (
        error ? '' :
            <>

                {/* Encabezado del formulario */}
                <h2 className='text-center text-gray-800 text-2xl font-bold'>Editar Cliente</h2>
                {/* Contenedor principal */}
                <div className='flex justify-center mt-5'>
                    <div className="w-full max-w-sm">
                        <Formik
                            validationSchema={schemaVlidation}
                            enableReinitialize
                            initialValues={data.obtenerProducto}
                            onSubmit={(values) => {
                                // console.log(values);//contiene los valores que se tipean 
                                handleUpdateProduct(values);
                            }
                            }

                        >
                            {props => {
                                return (
                                    <form action="" onSubmit={props.handleSubmit} className='bg-white rounded shadow-sm px-8 pt-6 pb-8 mb-4'>
                                        {/* Campo de Nombre */}
                                        <div className='mb-4'>
                                            <label htmlFor="nombre" className='block text-gray-700 text-sm font-bold mb-4'>
                                                {dictionary[idioma].name}
                                            </label>
                                            <input
                                                id='nombre'
                                                value={props.values.nombre}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                type="text"
                                                placeholder='Ingresa Nombre'
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            />
                                        </div>
                                        {/* Mensaje de error para el campo de Nombre */}
                                        {props.errors.nombre && props.touched.nombre && (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>{props.errors.nombre}</p>
                                            </div>
                                        )}

                                        {/* Campo de existencia */}
                                        <div className='mb-4'>
                                            <label htmlFor="Existencia" className='block text-gray-700 text-sm font-bold mb-4'>
                                                {dictionary[idioma].existence}
                                            </label>
                                            <input
                                                id='existencia'
                                                value={props.values.existencia}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                type="number"
                                                placeholder='Ingresa la existencia'
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            />
                                        </div>
                                        {/* Mensaje de error para el campo de existencia */}
                                        {props.errors.existencia && props.touched.existencia && (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>{props.errors.existencia}</p>
                                            </div>
                                        )}

                                        {/* Campo de precio */}
                                        <div className='mb-4'>
                                            <label htmlFor="empresa" className='block text-gray-700 text-sm font-bold mb-4'>
                                                Precio
                                            </label>
                                            <input
                                                id='precio'
                                                value={props.values.precio}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                type="number"
                                                placeholder='Ingresa Precio'
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            />
                                        </div>
                                        {/* Mensaje de error para el campo de empresa */}
                                        {props.errors.precio && props.touched.precio && (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>{props.errors.precio}</p>
                                            </div>
                                        )}

                                        {/* Botón de Registro */}
                                        <input
                                            type="submit"
                                            // disabled={props.isSubmitting} // Deshabilitar el botón mientras se esté enviando el formulario
                                            value="Registrar Producto"
                                            className="bg-gray-500 w-full mt-5 p-2 cursor-pointer text-white uppercase hover:bg-gray-900 "
                                        />
                                    </form>
                                )
                            }}




                        </Formik >
                    </div >
                </div >
            </>
    )
}
