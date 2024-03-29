import { useContext } from "react"
import PedidoContext from "../context/pedidos/PedidoContext"

export default function Total() {
    const pedido = useContext(PedidoContext)
   const { total } = pedido
    
  return (
    <div className="flex items-center mt-5 justify-between bg-white p-3 border-solid border-2 border-gray-300">
        <h2 className="text-gray-800 mt-0 ">Total a pagar:</h2>     
        <p className="text-gray-800 mt-0 ">$ {total.toFixed(2)}</p>     
    </div>
  )
}
