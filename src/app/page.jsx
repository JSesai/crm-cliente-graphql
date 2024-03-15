'use client'
import Cliente from "../components/Cliente";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import dictionary, { dictionaryUrls } from "./utils/diccionario";
// export const metadata = {
//   title: "CRM- Administra tus clientes",
//   description: "Aplicacion web para administrar tus clientes",
// }

const idioma = 'es'

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

function Index() {
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
  // console.log(data);
  // console.log(loading);
  // console.log(error);

  const router = useRouter();

  if (loading) return 'Cargando...';
  if (error) return 'Ocurrio un error al cargar datos, intente mas tarde o contacte a sesai'

  if (!data?.obtenerClientesVendedor) {
    console.log('logueate apa!!');
    // return localStorage.removeItem('token');
    // return router.push('/login');
  }


  return (
    <>
      <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
      <button
        className="bg-blue-800 px-5 py-2 mt-5 text-white rounded font-bold inline-block w-full lg:w-auto text-center"
        onClick={() => router.push(dictionaryUrls.customerNew)}
      >
        {dictionary[idioma].newCustomer}
      </button>
      {data?.obtenerClientesVendedor?.length > 0 ? <>

        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2">Eliminar</th>
                <th className="w-1/5 py-2">Editar</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.obtenerClientesVendedor.map(cliente => (
                <Cliente key={cliente.id} cliente={cliente} />
              ))}
            </tbody>
          </table>

        </div>
      </>
        : dictionary[idioma].noData}
    </>


  )
}

export default Index;
