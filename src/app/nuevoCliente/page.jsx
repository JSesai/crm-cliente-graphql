'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik'; // Biblioteca para gestionar formularios en React
import * as Yup from 'yup'; // Biblioteca para validación de esquemas
import { gql } from '@apollo/client'; // Biblioteca para trabajar con GraphQL
import { useMutation } from '@apollo/client';

// mutation de GraphQL para crear nuevo cliente
const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput){
    nuevoCliente(input: $input) {
      nombre
      apellido
      vendedor
    }
  }

`;

//No requieres importar usequery; 
// query para poder obtener los datos en cache, es el mismo que se usa en index y lo usamos como referencia en memoria cache para saber que es lo que necesita actualizar
const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor{
    obtenerClientesVendedor {
      id
      empresa
      nombre
      apellido
      email
    }
  }
`;

export default function NuevoCliente() {

    //states 
    const [mensaje, setMensaje] = useState(null); // Estado para mostrar mensajes de error
    // mutation para crear una nueva cuenta, nuevoUsuario es el metodo del mutation que usaremos para enviar los datos que se requieren y le pasamos como parametro lo que nos devolvera del mutation es decir lo que le pedimos que nos muestre cuando se crea el usuario y esto esta definido en lo types del schema 
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        //actualizar data de los clientes en la vista index con el cliente agregado, lo hacemos con el CACHE 
        update(cache, { data: { nuevoCliente } }) {
            //obtener el objeto de cache que vamos a actualizar, leemos el cache y le decimos que query es el que se va actualizar
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO });
            //! el cache nunca se debe mutar, hay que reescribirlo
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente] // agregar el cliente al final del arreglo de clientes  

                }
            })
        }
    });
    
    const router = useRouter(); // Navegar 
    // Validación del formulario con Formik y Yup
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('Nombre es Obligatorio'),
            apellido: Yup.string().required('Apellido es Obligatorio'),
            empresa: Yup.string().required('Empresa es Obligatorio'),
            email: Yup.string().email('El email no es valido').required('email es Obligatorio'),
            telefono: Yup.string().required('Telefono es Obligatorio').min(10, 'El telefono debe contener al menos 10 digitos').max(10, 'El telefono debe contener maximo 10 digitos'),
        }),
        onSubmit: async valores => {
            console.log('enviando', valores);
            // enviar los datos del formulario al servidor
            const { nombre, apellido, empresa, email, telefono } = valores;
            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });
                setMensaje(`Cliente Creado Correctamente`);
                console.log(data);
                setTimeout(() => {
                    setMensaje(null);
                    router.push('/'); // Navegar al inicio despues de 3 segundos

                }, 3000);
            } catch (error) {
                console.log(error);
                setMensaje(error.message);
                setTimeout(() => {
                    setMensaje(null);

                }, 3000);
            }
        }
    });

    //fn para mostrar el mensaje de error
    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p className='text-gray-800'>{mensaje}</p>
            </div>        
        )
    }
    return (
        <>
            {mensaje && mostrarMensaje()}
            {/* Encabezado del formulario */}
            <h2 className='text-center text-gray-800 text-2xl font-bold'>Nuevo Cliente</h2>
            {/* Contenedor principal */}
            <div className='flex justify-center mt-5'>
                <div className="w-full max-w-sm">
                    {/* Formulario */}
                    <form action="" onSubmit={formik.handleSubmit} className='bg-white rounded shadow-sm px-8 pt-6 pb-8 mb-4'>
                        {/* Campo de Nombre */}
                        <div className='mb-4'>
                            <label htmlFor="nombre" className='block text-gray-700 text-sm font-bold mb-4'>
                                Nombre
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

                        {/* Campo de Apellido */}
                        <div className='mb-4'>
                            <label htmlFor="apellido" className='block text-gray-700 text-sm font-bold mb-4'>
                                Apellido
                            </label>
                            <input
                                id='apellido'
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="text"
                                placeholder='Ingresa Apellidos'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </div>
                        {/* Mensaje de error para el campo de Apellido */}
                        {formik.errors.apellido && formik.touched.apellido && (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>{formik.errors.apellido}</p>
                            </div>
                        )}

                        {/* Campo de empresa */}
                        <div className='mb-4'>
                            <label htmlFor="empresa" className='block text-gray-700 text-sm font-bold mb-4'>
                                Empresa
                            </label>
                            <input
                                id='empresa'
                                value={formik.values.empresa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="text"
                                placeholder='Ingresa Empresa'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </div>
                        {/* Mensaje de error para el campo de empresa */}
                        {formik.errors.empresa && formik.touched.empresa && (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>{formik.errors.empresa}</p>
                            </div>
                        )}

                        {/* Campo de Email */}
                        <div className='mb-4'>
                            <label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-4'>
                                Email
                            </label>
                            <input
                                id='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="email"
                                placeholder='Email Cliente'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </div>
                        {/* Mensaje de error para el campo de Email */}
                        {formik.errors.email && formik.touched.email && (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>{formik.errors.email}</p>
                            </div>
                        )}

                        {/* Campo de telefono */}
                        <div className='mb-4'>
                            <label htmlFor="telefono" className='block text-gray-700 text-sm font-bold mb-4'>
                                Teléfono
                            </label>
                            <input
                                id='telefono'
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="tel"
                                placeholder='Ingresa Teléfono'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </div>
                        {/* Mensaje de error para el campo de telefono */}
                        {formik.errors.telefono && formik.touched.telefono && (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>{formik.errors.telefono}</p>
                            </div>
                        )}


                        {/* Botón de Registro */}
                        <input
                            type="submit"
                            disabled={formik.isSubmitting} // Deshabilitar el botón mientras se esté enviando el formulario
                            value="Registrar Cliente"
                            className="bg-gray-500 w-full mt-5 p-2 cursor-pointer text-white uppercase hover:bg-gray-900 "
                        />
                    </form>
                </div>
            </div>
        </>
    )
}
