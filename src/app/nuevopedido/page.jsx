'use client'
import { useContext } from 'react'
import AsignarCliente from '../../components/AsignarCliente'
import AsignarProducto from '../../components/AsignarProducto'
import PedidoContext from '../../context/pedidos/PedidoContext'
import ResumenPedido from '../../components/ResumenPedido'
import Total from '../../components/Total'
import { gql } from '@apollo/client'; // Biblioteca para trabajar con GraphQL
import { useMutation } from '@apollo/client';
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation'
import dictionary, {dictionaryUrls} from '../utils/diccionario'

const idioma = 'es';
// mutation de GraphQL para crear nuevo cliente
const NUEVO_PEDIDO = gql`
mutation nuevoPedido($input: PedidoInput){
    nuevoPedido(input: $input){
      id    
  }
}
`;

//mutation para actualizar el estado del pedido en cache, lo usamos para cuando se agrega un nuevo pedido
const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        empresa
        telefono
        email
      }
      vendedor
      total
      estado
    }
  }
`;

export default function NuevoPedido() {

    //utilizar context y extraer sus funciones y valores
    const pedidoContext = useContext(PedidoContext)
   
    //hacemos uso del mutation, recuerda que regresa la funcion que esta en grapql porlo que destructuramos este mismo
    const [nuevoPedido] = useMutation(NUEVO_PEDIDO,{
        update(cache, { data: { nuevoPedido } }) {
            //obtenemos los pedidos del cache
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS
            })
            //agregamos el nuevo pedido al cache
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
        }
    })
    
    //extraemos datos del context
    // console.log(pedidoContext)
    const { cliente, productos, total } = pedidoContext

    const validarPedido = () => {
        // console.log(productos.every(producto => producto.cantidad > 0 || total === 0 || cliente.length === 0 ? " opacity-50 cursor-not-allowed " : ""))
        return !productos.every(producto => producto.cantidad > 0) || productos.length === 0 || total === 0 || cliente.length === 0 ? " opacity-50 cursor-not-allowed " : ""
    }

    const router = useRouter()
    const handleSubmit = async () => {
       
        const { id } = cliente //id del cliente
        //extraemos solo lo que necesitamos en pedido que es el id y la cantidad de los productos
        // console.log(pedido);
        const pedido = productos.map(({ __typename, existencia, ...producto }) => producto) //destructuramos y quitamos lo que no necesitamos
        // console.log(id);
        // console.log(total);
        //hacemos uso del mutation para poder crear el pedido
        try {
            const { data } = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        pedido,
                        total
                    }
                }
            })
            //extraemos data que nos devuelve la funcion de nuevo pedido
            console.log(data);
            if(data.nuevoPedido){                    
                Swal.fire({
                    title: 'Notificación' ,
                    text: 'Pedido Creado Correctamente!!',
                    icon: "success"
                });
                router.push(`${dictionaryUrls.orders}`); // Navegar al inicio despues de 3 segundos
            } 
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
            console.log(error);
        }
    }

    return (
        <>
            <h1 className="text-2xl text-gray-800 font-light">Crear {dictionary[idioma].newOrder}</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarProducto />
                    <ResumenPedido />
                    <Total />
                    <button
                        type="button"
                        disabled={validarPedido()}
                        onClick={handleSubmit}
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900${validarPedido()}`}
                    > 
                    {dictionary[idioma].registerOrder}
                    </button>

                </div>
            </div>

        </>
    )
}
