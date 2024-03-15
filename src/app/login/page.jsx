'use client'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import dictionary from "../utils/diccionario"


const idioma = 'es'; // Podrías obtenerlo dinámicamente
const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticartInput){
    autenticarUsuario(input: $input){
        token
    }
  }`;


export default function Login() {
    // localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjU3NWI2MmExN2M1OWJiZDM0YjY2MCIsImVtYWlsIjoiY29ycmVvQGNvcnJlby5jb20iLCJub21icmUiOiJKdWxpbyBTZXNhaSIsImFwZWxsaWRvIjoic2FuY2hleiIsImlhdCI6MTcwNjcxNTUxMywiZXhwIjoxNzA2ODAxOTEzfQ.6L-DoSFcDxB1EybstBGH0XeOtsCk2rIpZIURO3zklmY');

    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO); //para poder hacer las mutaciones de graphql, se usa el useMutation, se le pasa el query que se va a ejecutar y se le pasa el objeto con los datos que se van a enviar al query, se puede usar el useMutation para hacer las mutaciones de graphql, se usa el useMutation, se le pasa el query que se va a ejecutar y se le pasa el objeto con los datos que se van a enviar al query, se puede usar el useMutation para hacer las mutaciones de graphql, se usa el useMutation, se le pasa el query que se va a ejecutar y se le pasa el objeto con los datos que se van a enviar al query, se puede usar el useMutation para hacer las mutaciones de graphql, se usa el useMutation, se le pasa el query que se va a ejecutar y se le pasa el objeto con los datos que se van a enviar al query, se puede usar el useMutation para hacer
    const [mensaje, setMensaje] = useState(null); //para mostrar un mensaje de error o exito al usuario, se usa el useState, se le pasa el valor inicial y se le pasa una funcion que se va a ejecutar cuando se cambie el valor del estado, se puede usar el useState
    const router = useRouter() //para poder navegar
    const formik = useFormik({
        initialValues: {//valores iniciales con los que arranca los inputs del formulario
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email(dictionary[idioma].invalidEmail).required(dictionary[idioma].emailRequired),
            password: Yup.string().required(dictionary[idioma].passwordRequired).min(3, dictionary[idioma].passwordMinLength)
        }),
        onSubmit: async valores => {
            console.log(valores);
            const { email, password } = valores;
            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })
                console.log(data);
                setTimeout(() => {
                    const { token } = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                }, 1000)
                
                setTimeout(() => {
                    setMensaje(null);
                    return router.push('/'); // Navegar a la pagina principal despues de 3 segundos

                }, 2000);

            } catch (error) {
                console.log(error);
                setMensaje(error.message);
                setTimeout(() => {
                    setMensaje(null)
                }, 3000);
            }
        }

    })
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
            <h1 className='text-center text-white text-2xl font-light'>Login</h1>
            <div className='flex justify-center mt-5'>
                <div className="w-full max-w-sm">
                    <form action="" onSubmit={formik.handleSubmit} className='bg-white rounded shadow-sm px-8 pt-6 pb-8 mb-4'>
                        <div className='mb-4'>
                            <label htmlFor="email"
                                className='block text-gray-700 text-sm font-bold mb-4'
                            >
                                Email
                            </label>
                            <input
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id='email'
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

                        <div className='mb-4'>
                            <label htmlFor="password"
                                className='block text-gray-700 text-sm font-bold mb-4'
                            >
                                Password
                            </label>
                            <input
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id='password'
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
                        {/* Boton de Iniciar Sesion */}
                        <input
                            disabled={formik.isSubmitting}
                            type="submit"
                            value="Iniciar Sesión"
                            className="bg-gray-500 w-full mt-5 p-2 cursor-pointer text-white uppercase hover:bg-gray-900 "
                        />
                    </form>

                </div>
            </div>
        </>
    )
}
