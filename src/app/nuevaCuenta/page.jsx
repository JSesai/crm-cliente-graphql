// Importación de módulos y componentes necesarios
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik'; // Biblioteca para gestionar formularios en React
import * as Yup from 'yup'; // Biblioteca para validación de esquemas
import { gql } from '@apollo/client'; // Biblioteca para trabajar con GraphQL
import { useMutation } from '@apollo/client';
// Definición de la consulta GraphQL
const NUEVA_CUENTA = gql`
mutation nuevoUsuario($input:UsuarioInput){
  nuevoUsuario(input: $input){
    id
    nombre
    apellido
    email
  }
}
`;

// Componente principal para la creación de una nueva cuenta
export default function NuevaCuenta() {
  //state
  const [mensaje, setMensaje] = useState(null);

  // mutation para crear una nueva cuenta, nuevoUsuario es el metodo del mutation que usaremos para enviar los datos que se requieren y le pasamos como parametro lo que nos devolvera del mutation es decir lo que le pedimos que nos muestre cuando se crea el usuario y esto esta definido en lo types del schema 
  const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA);

  const router = useRouter(); // Utilidad para navegar entre paginas

  // Validación del formulario con Formik y Yup
  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El Nombre es Obligatorio'),
      apellido: Yup.string().required('El Apellido es Obligatorio'),
      email: Yup.string().email('El email no es valido').required('El email es Obligatorio'),
      password: Yup.string().required('El password es Obligatorio').min(3, 'El password debe contener al menos 3 caracteres')
    }),
    onSubmit: async valores => {
      console.log('enviando', valores);
      // enviar los datos del formulario al servidor
      const { nombre, apellido, email, password } = valores;
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input:{
              nombre,
              apellido,
              email,
              password
            }
          }
        });
        setMensaje(`Usuario Creado Correctamente: ${data.nuevoUsuario.nombre}`);
        console.log(data);
        setTimeout(() => {
          setMensaje(null);
          router.push('/login'); // Navegar al login despues de 3 segundos

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

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p className='text-red-500'>{mensaje}</p>
      </div>
    )
  }
  

  return (
    <>
    {mensaje && mostrarMensaje()}
      {/* Encabezado del formulario */}
      <h2 className='text-center text-white text-2xl font-light'>Crear Nueva Cuenta</h2>
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
                placeholder='Ingresa tu Nombre'
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
                placeholder='Email Usuario'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {/* Mensaje de error para el campo de Email */}
            {formik.errors.email && formik.touched.email && (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>{formik.errors.email}</p>
              </div>
            )}

            {/* Campo de Password */}
            <div className='mb-4'>
              <label htmlFor="password" className='block text-gray-700 text-sm font-bold mb-4'>
                Password
              </label>
              <input
                id='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="password"
                placeholder='password Usuario'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {/* Mensaje de error para el campo de Password */}
            {formik.errors.password && formik.touched.password && (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>{formik.errors.password}</p>
              </div>
            )}
            {/* Botón de Registro */}
            <input
              type="submit"
              disabled={formik.isSubmitting} // Deshabilitar el botón mientras se esté enviando el formulario
              value="Registrarme"
              className="bg-gray-500 w-full mt-5 p-2 cursor-pointer text-white uppercase hover:bg-gray-900 "
            />
          </form>
        </div>
      </div>
    </>
  );
}
