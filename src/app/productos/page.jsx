'use client'
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";
import Card from "../../components/Card"
import dictionary, {dictionaryUrls} from "../utils/diccionario";
import { useRouter } from "next/navigation";
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


export default function Productos() {
  const router = useRouter()
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS)
  // console.log(data);
  if (loading) return 'loading...'
  if (error) return 'error'

  if(data.obtenerProductos.length === 0) return dictionary[idioma].noData;

  return (
    
    <>
      <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
      <button
        className="bg-blue-800 px-5 py-2 mt-5 text-white rounded font-bold"
        onClick={() => router.push(dictionaryUrls.newProducts)}
      >
        {dictionary[idioma].newProduct}
      </button>

      <div className="flex flex-wrap justify-center">
        {data.obtenerProductos.map(producto => (
          <Card key={producto.id} producto={producto} />
        ))}
      </div>
    </>

  )
}
