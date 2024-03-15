'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup'; // Biblioteca para validación de esquemas
import { gql } from '@apollo/client'; // Biblioteca para trabajar con GraphQL
import { useMutation } from '@apollo/client';
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Swal from 'sweetalert2';
import { Formik } from 'formik';

// mutation de GraphQL para obtener un cliente
const OBTENER_CLIENTE = gql`
query obtenerCliente ($id: ID!) {
  obtenerCliente(id: $id) {
    nombre
    apellido
    empresa
    email
    telefono
  }
}

`;
// mutation de GraphQL para editar un cliente
const EDITAR_CLIENTE = gql`
mutation actualizarCliente($id: ID!, $input: ClienteInput){
  actualizarCliente(id: $id, input: $input){
    nombre
    email
    apellido
  }
}
`;

export default function EditarCliente({ params }) {
  console.log(params.clienteId);
  const id = params.clienteId;
  const [mensaje, setMensaje] = useState(null);

  const router = useRouter(); // Navegar 
  const navegar = direccion => {
    router.push(`/${direccion}`)
  }

  const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id
    }
  });
  // console.log(data);
  // console.log(loading);
  // console.log(error);

  const [actualizarCliente] = useMutation(EDITAR_CLIENTE);

  // Validación del formulario con Formik y Yup
  // const formik = useFormik({
  //     initialValues: {
  //         nombre: '',
  //         apellido: '',
  //         empresa: '',
  //         email: '',
  //         telefono: '',
  //     },
  //     validationSchema: Yup.object({
  //         nombre: Yup.string().required('Nombre es Obligatorio'),
  //         apellido: Yup.string().required('Apellido es Obligatorio'),
  //         empresa: Yup.string().required('Empresa es Obligatorio'),
  //         email: Yup.string().email('El email no es valido').required('email es Obligatorio'),
  //         telefono: Yup.string().required('Telefono es Obligatorio').min(10, 'El telefono debe contener al menos 10 digitos').max(10, 'El telefono debe contener maximo 10 digitos'),
  //     }),
  //     onSubmit: async valores => {
  //         console.log('enviando', valores);
  //         // enviar los datos del formulario al servidor
  //         const { nombre, apellido, empresa, email, telefono } = valores;
  //         try {
  //             const { data } = await nuevoCliente({
  //                 variables: {
  //                     input: {
  //                         nombre,
  //                         apellido,
  //                         empresa,
  //                         email,
  //                         telefono
  //                     }
  //                 }
  //             });
  //             setMensaje(`Cliente Creado Correctamente`);
  //             console.log(data);
  //             setTimeout(() => {
  //                 setMensaje(null);
  //                 router.push('/'); // Navegar al inicio despues de 3 segundos

  //             }, 3000);
  //         } catch (error) {
  //             console.log(error);
  //             setMensaje(error.message);
  //             setTimeout(() => {
  //                 setMensaje(null);

  //             }, 3000);
  //         }
  //     }
  // });

  //fn para mostrar el mensaje de error
  const mostrarMensaje = () => {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
          <p className='text-gray-800'>{mensaje}</p>
        </div>
      </div>
    )
  }


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
    }).then((result) => {
      console.log(result.isConfirmed);
      console.log(result);
      if (result.isConfirmed) {
        // console.log('aceptaste, ahora seras direccionado..');
        // console.log(result.isConfirmed);
        navegar('/');
      }
      if (result.dismiss) {
        // console.log('no aceptaste, ahora seras direccionado..');
        // console.log(result.isConfirmed); 

        navegar('/'); // Navegar al inicio despues de 2 segundos


      }

    })
  }

  // Validación del formulario con Formik y Yup
  const schemaVlidation = Yup.object({
    nombre: Yup.string().required('Nombre es Obligatorio'),
    apellido: Yup.string().required('Apellido es Obligatorio'),
    empresa: Yup.string().required('Empresa es Obligatorio'),
    email: Yup.string().email('El email no es valido').required('email es Obligatorio'),
    telefono: Yup.string().required('Telefono es Obligatorio').min(10, 'El telefono debe contener al menos 10 digitos').max(10, 'El telefono debe contener maximo 10 digitos'),
  });

  //fn que manda la actualizacion del cliente
  const handleUpdateClient = async (values) => {
    const { nombre, apellido, empresa, email, telefono } = values;
    try {
      const { data } = await actualizarCliente({
        variables: {
          id,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono
          }
        }
      })
      // console.log(data);
      Swal.fire(
        'Actualizado',
        'Cliente Actualizado Correctamente!!',
        'success'
      )
      navegar('/'); // Navegar al inicio 
    } catch (error) {
      Swal.fire(
        'Actualizado',
        error.message,
        'error'
      )
      console.log(error);
    }

  }

  return (
    error ? '' :
      <>
        {mensaje && mostrarMensaje()}
        {/* Encabezado del formulario */}
        <h2 className='text-center text-gray-800 text-2xl font-bold'>Editar Cliente</h2>
        {/* Contenedor principal */}
        <div className='flex justify-center mt-5'>
          <div className="w-full max-w-sm">
            <Formik
              validationSchema={schemaVlidation}
              enableReinitialize
              initialValues={data.obtenerCliente}
              onSubmit={(values) => {
                // console.log(values);//contiene los valores que se tipean 
                handleUpdateClient(values);
              }
              }

            >
              {props => {
                console.log(props);
                {/* Formulario */ }
                return (
                  <form action="" onSubmit={props.handleSubmit} className='bg-white rounded shadow-sm px-8 pt-6 pb-8 mb-4'>
                    {/* Campo de Nombre */}
                    <div className='mb-4'>
                      <label htmlFor="nombre" className='block text-gray-700 text-sm font-bold mb-4'>
                        Nombre
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

                    {/* Campo de Apellido */}
                    <div className='mb-4'>
                      <label htmlFor="apellido" className='block text-gray-700 text-sm font-bold mb-4'>
                        Apellido
                      </label>
                      <input
                        id='apellido'
                        value={props.values.apellido}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        type="text"
                        placeholder='Ingresa Apellidos'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      />
                    </div>
                    {/* Mensaje de error para el campo de Apellido */}
                    {props.errors.apellido && props.touched.apellido && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>{props.errors.apellido}</p>
                      </div>
                    )}

                    {/* Campo de empresa */}
                    <div className='mb-4'>
                      <label htmlFor="empresa" className='block text-gray-700 text-sm font-bold mb-4'>
                        Empresa
                      </label>
                      <input
                        id='empresa'
                        value={props.values.empresa}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        type="text"
                        placeholder='Ingresa Empresa'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      />
                    </div>
                    {/* Mensaje de error para el campo de empresa */}
                    {props.errors.empresa && props.touched.empresa && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>{props.errors.empresa}</p>
                      </div>
                    )}

                    {/* Campo de Email */}
                    <div className='mb-4'>
                      <label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-4'>
                        Email
                      </label>
                      <input
                        id='email'
                        value={props.values.email}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        type="email"
                        placeholder='Email Cliente'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      />
                    </div>
                    {/* Mensaje de error para el campo de Email */}
                    {props.errors.email && props.touched.email && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>{props.errors.email}</p>
                      </div>
                    )}

                    {/* Campo de telefono */}
                    <div className='mb-4'>
                      <label htmlFor="telefono" className='block text-gray-700 text-sm font-bold mb-4'>
                        Teléfono
                      </label>
                      <input
                        id='telefono'
                        value={props.values.telefono}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        type="tel"
                        placeholder='Ingresa Teléfono'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      />
                    </div>
                    {/* Mensaje de error para el campo de telefono */}
                    {props.errors.telefono && props.touched.telefono && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>{props.errors.telefono}</p>
                      </div>
                    )}


                    {/* Botón de Registro */}
                    <input
                      type="submit"
                      // disabled={props.isSubmitting} // Deshabilitar el botón mientras se esté enviando el formulario
                      value="Actualizar Cliente"
                      className="bg-gray-500 w-full mt-5 p-2 cursor-pointer text-white uppercase hover:bg-gray-900 "
                    />
                  </form>
                )
              }}

            </Formik>
          </div>
        </div>
      </>
  )

}
