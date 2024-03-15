'use client'
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client"
import dictionary, { dictionaryUrls } from "../utils/diccionario"
import Pedido from "../../components/Pedido"
import { useRouter } from "next/navigation";

const idioma = 'es';

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

export default function Pedidos() {
  const router = useRouter()
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS)
  // console.log(data);
  // console.log(loading);
  // console.log(error);

  if(loading) return null
  if (error) return 'Contacte a desarrollo'
 const {obtenerPedidosVendedor} = data

 const navega = () => {
  console.log('navegando');
  // router.push(dictionaryUrls.orderNew)
 }
  return (
    <>
      <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
      <button
        className="bg-blue-800 px-5 py-2 mt-5 text-white rounded font-bold"
        onClick={() => router.push(dictionaryUrls.newOrder)}
      >
        {dictionary[idioma].newOrder}
      </button>

      {obtenerPedidosVendedor.length > 0 ? (
        obtenerPedidosVendedor.map(pedido => (
          <Pedido key={pedido.id} pedido={pedido} />
        ))
      ) : <p className="mt-5 text-center text-2xl ">No hay pedidos Aún</p>}
    </>
  )
}
