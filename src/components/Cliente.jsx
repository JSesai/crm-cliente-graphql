'use client'
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import { usePathname } from 'next/navigation'
import dictionary, {dictionaryUrls} from "../app/utils/diccionario";

const idioma = 'es';

const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!){
    eliminarCliente(id: $id)  
  }
`;

//No requieres importar usequery; 
// query para poder obtener los datos en cache, es el mismo que se usa en index y lo usamos como referencia en memoria cache para saber que es lo que necesita actualizar
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

export default function Cliente({ cliente }) {

    const router = useRouter(); //navegacion con next
    const pathname = usePathname(); //navegacion con next

    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            //obtener una copia del objeto de cache
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO });

            //reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(clienteActual => clienteActual.id !== id)
                }
            });
        }
    });
    const { nombre, apellido, empresa, email, id } = cliente;

    const handlerDeleteCliente = () => {
        Swal.fire({
            title: dictionary[idioma].comfirmDeleteCustomer,
            text: dictionary[idioma].warningMessage,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: dictionary[idioma].confirmButtonText,
            cancelButtonText: dictionary[idioma].cancelButtonText
        }).then(async (result) => {

            //si presiona el boton de confirmar
            if (result.isConfirmed) {
                try {
                    //ejecuta fn para eliminar cliente
                    const { data } = await eliminarCliente({
                        variables: {
                            id
                        }
                    });
                    console.log(data);
                    //si existe data.eliminarCliente se muestra mensaje de exito
                    if (data.eliminarCliente) {
                        //se muestra alerta de exito
                        Swal.fire({
                            title: dictionary[idioma].removed ,
                            text: data.eliminarCliente,
                            icon: "success"
                        });

                    }

                } catch (error) {
                    console.log(error);
                    //se muestra alerta de error
                    Swal.fire({
                        title: 'Error!',
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })

                }
            }
        });
    }

    const handlerEditarCliente = () => {
        router.push(`/editarcliente/${id}`)
    }


    return (
        <tr>
            <td className="border px-4 py-2">{nombre} {apellido}</td>
            <td className="border px-4 py-2">{empresa}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">
                <button
                    title="Eliminar"
                    type="button"
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => handlerDeleteCliente()}
                >
                    {/* icono de heroicons.com */}
                    {dictionary[idioma].delete}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>

                </button>
            </td>

            <td className="border px-4 py-2">
                <button
                    title="Editar"
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => handlerEditarCliente()}
                >
                    {/* icono de heroicons.com */}
                    {dictionary[idioma].edit}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>


                </button>
            </td>

        </tr>
    )
}
