'use client'
import { useState, useEffect, useContext } from 'react'
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";
import Select from 'react-select'
import PedidoContext from '../context/pedidos/PedidoContext';

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
export default function AsignarCliente() {

    const [cliente, setCliente] = useState([])
    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO); // QUERY de graphql 
    const pedidoContext = useContext(PedidoContext) // context del pedido
    const { agregarClilente } = pedidoContext


    useEffect(() => {
        agregarClilente(cliente)
    }, [cliente])

    // console.log(data);
    // console.log(loading);
    // console.log(error);
    //utilizar context y extraer sus funciones y valores

  
    if (loading) return 'Cargando...';
    if (error) return 'Ocurrio un error al cargar datos, intente mas tarde o contacte a sesai'

    if (!data?.obtenerClientesVendedor) {
        console.log('logueate apa!!');
        // return localStorage.removeItem('token');
        // return router.push('/login');
    }

    //extraemos lo que devuelve data que comunmente es la funcion definida en el query que usamos en graphql
    const { obtenerClientesVendedor } = data

    const selecionarCliente = (cliente) => {
        setCliente(cliente)
    }

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Selecciona un Cliente al pedido</p>
            <Select
                className="mt-3"
                options={obtenerClientesVendedor}
                onChange={opcion => selecionarCliente(opcion)}
                getOptionValue={opcion => opcion.id}
                getOptionLabel={opcion => opcion.nombre}
                placeholder='Seleccione'
                noOptionsMessage={() => "No hay resultados"}

            />
        </>
    )
}
