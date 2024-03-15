import { useState, useContext, useEffect } from "react";
import PedidoContext from "../context/pedidos/PedidoContext";


export default function ProductoResumen({ producto }) {
    const { nombre, precio, existencia, id } = producto;
    const [cantidad, setCantidad] = useState(0);

    const pedido = useContext(PedidoContext)
    const { cantidadProductos, actualixarTotal } = pedido

    useEffect(()=>{
        actualizarCantidad(cantidad)
        actualixarTotal()
    },[cantidad])

    const actualizarCantidad = () => {
        const nuevoProducto = {
            ...producto,
            cantidad: Number(cantidad)
        }
        cantidadProductos(nuevoProducto)
        // console.log(nuevoProducto)
    }

    return (
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className="md:w-2/4 mb-2 md:mb-0 ">
                <p className="text-sm">{nombre}</p>
                <p>$ {precio}</p>
            </div>
            <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
            type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
            />

        </div>
    )
}
