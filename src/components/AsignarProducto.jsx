'use client'
import { useState, useEffect, useContext } from 'react'
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useRouter } from 'next/navigation';
import { gql } from "@apollo/client";
import Select from 'react-select'
import PedidoContext from '../context/pedidos/PedidoContext';

const idioma = 'es';

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

export default function AsignarProducto() {

    const [producto, setProdcuto] = useState([])
    const { data, loading, error, startPolling, stopPolling } = useQuery(OBTENER_PRODUCTOS)
    const pedidoContext = useContext(PedidoContext) // context del pedido
    const { agregarProducto } = pedidoContext


    useEffect(() => {
        agregarProducto(producto)
    }, [producto])

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])
    
    // console.log(data);
    // console.log(loading);
    // console.log(error);
    //utilizar context y extraer sus funciones y valores

    const router = useRouter();

    if (loading) return null;
    if (error) return 'Ocurrio un error al cargar datos, intente mas tarde o contacte a sesai'

    if (!data?.obtenerProductos) {
        console.log('logueate apa!!');
        // return localStorage.removeItem('token');
        // return router.push('/login');
    }

    //extraemos lo que devuelve data que comunmente es la funcion definida en el query que usamos en graphql
    const { obtenerProductos } = data
    // console.log(data);

    const selecionarProducto = (producto) => {
        setProdcuto(producto)
    }

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Selecciona  productos</p>
            <Select
                className="mt-3"
                isMulti={true}
                options={obtenerProductos}
                onChange={opcion => selecionarProducto(opcion)}
                getOptionValue={opcion => opcion.id}
                getOptionLabel={opcion => `${opcion.nombre} - ${opcion.existencia} Disponibles`}
                placeholder='Seleccione producto'
                noOptionsMessage={() => "No hay resultados"}

            />
        </>
    )
}
