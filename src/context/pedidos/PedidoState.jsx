import React, { useReducer } from 'react'
import PedidoContext from './PedidoContext'
import PedidoReducer from './PedidoReducer'
import { SELECCIONAR_CLIENTE, SELECCIONAR_PRODUCTO, CANTIDAD_PRODUCTOS, ACTULIZAR_TOTAL } from '../../types/page'


export default function PedidoState({ children }) {
    // ESTATE INICIAL DE PEDIDOS
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }

    //usamos use reducer que destructura el estate actual y dispatch que es el que dispara la funcion que el usuario a clickado
    const [state, dispatch] = useReducer(PedidoReducer, initialState)

    // funcion que modifica el usuario modificado, se hace disponible para que pueda ser usado en todos los componentes
    const agregarClilente = cliente => {
        // console.log(cliente);

        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    //agregar producto al arreglo de productos
    const agregarProducto = productosSeleccionados => {
        console.log(productosSeleccionados);
        let nuevoState;
        if (state.productos.length > 0) {
            //tomar el segundo arreglo y asignarlo al primero
            nuevoState = productosSeleccionados.map(producto => {
                const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id)
                return { ...producto, ...nuevoObjeto }
            })
        } else {
            nuevoState = productosSeleccionados
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    //modifica las cantidades de los productos
    const cantidadProductos = cantidadProducto => {
        console.log('desde pedido estate', cantidadProducto)
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: cantidadProducto
        })
    }

    //actualiza el total del pedido
    const actualixarTotal = () => {
        dispatch({
            type: ACTULIZAR_TOTAL
        })
    }

    return (
        <PedidoContext.Provider 
            value={{
                total: state.total,
                productos: state.productos,
                cliente: state.cliente,
                agregarClilente,
                agregarProducto,
                cantidadProductos,
                actualixarTotal

            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}
