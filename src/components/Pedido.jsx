import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import dictionary from '../app/utils/diccionario';
import Swal from 'sweetalert2';

const idioma = 'es';
//mutation para actualizar el estado del pedido
const ACTULIZAR_PEDIDO = gql`
mutation actualizarPedido($id: ID!, $input: PedidoInput){
    actualizarPedido(id: $id, input: $input){
      id
      estado
    }
  }
`;
//mutation para eliminar el pedido
const ELIMINAR_PEDIDO = gql`
  mutation eliminarPedido($id: ID!){
    eliminarPedido(id: $id)
  }
`;

//mutation para actualizar el estado del pedido
const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id    
    }
  }
`;


export default function Pedido({ pedido }) {

    const { id, total, cliente, estado } = pedido

    const [actualizarPedido] = useMutation(ACTULIZAR_PEDIDO);
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO,{
        update(cache){
            const {obtenerPedidosVendedor} = cache.readQuery({
                query: OBTENER_PEDIDOS
            })

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data:{
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedidoActual => pedidoActual.id !== id)
                }
            })
        }
    })

    const [estadoPedido, setEstadoPedido] = useState(estado)
    const [clase, setClase] = useState('')

    useEffect(() => {
        clasePedido()
    }, [estadoPedido])

    const formattedTotal = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    //fn que cambia el estado del pedido y la clase css
    const cambiarEstado = async (estado) => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: estado,
                        cliente: cliente.id
                    }
                }
            })
            console.log(data);
            setEstadoPedido(data.actualizarPedido.estado)
        } catch (error) {
            console.log(error);
        }
    }

    //fn que elimina el pedido
    const eliminaPedido = async () => {
        Swal.fire({
            title: "¿Deseas Eliminar este Pedido",
            text: "Esta Acción es Irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar",
            cancelButtonText: "No, Cancelar"
        }).then(async (result) => {

            //si presiona el boton de confirmar
            if (result.isConfirmed) {
                try {
                    const { data } = await eliminarPedido({
                        variables: {
                            id
                        }
                    })

                    Swal.fire({
                        title: "Pedido Eliminado",
                        text: data.eliminaPedido,
                        icon: "success"
                    })
                            
                } catch (error) {
                    console.log(error);
        
                }
            }
        });
    }

    //fn que modifica el color del pedido de acuerdo a su estado
    const clasePedido = () => {
        if (estadoPedido === 'PENDIENTE') {
            setClase('border-yellow-500')
        } else if (estadoPedido === 'COMPLETADO') {
            setClase('border-green-500')
        } else {
            setClase('border-red-800')
        }
    }

    return (
        <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className="font-bold text-gray-800">{cliente?.nombre ? `Cliente:  ${cliente?.nombre}  ${cliente?.apellido} ` : 'Sin Nombre'}</p>
                {cliente?.email && (
                    <p className="text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        {cliente?.email}
                    </p>
                )}
                {cliente?.telefono && (
                    <p className="text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>

                        {cliente?.telefono}
                    </p>
                )}
                <h2 className="text-gray-800 font-bold mt-10">Estado Pedido:</h2>
                <select
                    value={estadoPedido}
                    onChange={(e) => cambiarEstado(e.target.value)}
                    className='mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold '
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>

                </select>
            </div>

            <div>
                <h2 className='text-gray-800 font-bold mt-2'>Resumen del Pedido</h2>
                {pedido.pedido.map(articulo => (
                    <div key={articulo.id} className='mt-4'>
                        <p className='text-sm text-gray-600'>Producto: {articulo.nombre}</p>
                        <p className='text-sm text-gray-600'>Cantidad: {articulo.cantidad}</p>
                    </div>
                ))}
                <p className='text-gray-800 mt-3 font-bold'>Total a pagar:
                    <span className='font-bold'> {formattedTotal}</span>
                </p>

                <button
                    onClick={eliminaPedido}
                    className='uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight'
                >
                    {dictionary[idioma].delete}
                    {/* icono de heroicons.com */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>

                </button>

            </div>

        </div>
    )
}
