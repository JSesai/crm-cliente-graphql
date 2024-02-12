import React from 'react'

export default function Login() {
    return (
        <>
            <h1 className='text-center text-white text-2xl font-light'>Desde el Login</h1>
            <div className='flex justify-center mt-5'>
                <div className="w-full max-w-sm">
                    <form action="" className='bg-white rounded shadow-sm px-8 pt-6 pb-8 mb-4'>
                        <div className='mb-4'>
                            <label htmlFor="email"
                                className='block text-gray-700 text-sm font-bold mb-4'
                            >
                                Email
                            </label>
                            <input
                                id='email'
                                type="email"
                                placeholder='Email Usuario'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                            />

                        </div>
                        <div className='mb-4'>
                            <label htmlFor="password"
                                className='block text-gray-700 text-sm font-bold mb-4'
                            >
                                Password
                            </label>
                            <input
                                id='password'
                                type="password"
                                placeholder='password Usuario'
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                            />

                        </div>
                        <input 
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
