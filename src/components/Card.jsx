'use client'
import dictionary, {dictionaryUrls} from "../app/utils/diccionario";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import Swal from "sweetalert2";

const idioma= 'es';

const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!){
    eliminarProducto(id: $id)
  }
`;

//No requieres importar usequery; 
// query para poder obtener los datos en cache,y lo usamos como referencia en memoria cache para saber que es lo que necesita actualizar
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

export default function Card({ producto }) {
    const { nombre, precio, existencia, id  } = producto;

    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            //obtener una copia del objeto de cache
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

            //reescribir el cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(productoActual => productoActual.id !== id)
                }
            });
        }
    });

    const router = useRouter();
    const handlerEditarProduct = () => {
        // console.log(`${dictionaryUrls.editProduct}/${id}`);
        router.push(`${dictionaryUrls.editProduct}/${id}`)
    }

    const handlerDeleteProduct = () => {
        Swal.fire({
            title: dictionary[idioma].comfirmDeleteProduct,
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
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    });
                    console.log(data);
                    //si existe data.eliminarCliente se muestra mensaje de exito
                    if (data.eliminarProducto) {
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
    
  return (
    <div className="max-w-sm rounded-md overflow-hidden shadow-lg m-4 bg-white">
      {/* <img className="w-full" src={img} alt="Card" /> */}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{nombre}</div>
        <p className="text-gray-700 text-base">${precio.toFixed(2)}</p>
        <p className="text-gray-700 text-base">{dictionary[idioma].available} {existencia}</p>
        <div className="flex justify-between">
            <button
                title={dictionary[idioma].edit}
                type="button"
                className="flex justify-center items-center bg-green-600 py- px-4  text-white rounded text-xs uppercase font-bold"
                onClick={() => handlerEditarProduct()}
            >
                {/* icono de heroicons.com */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>


            </button>
            <button
                title={dictionary[idioma].delete}
                type="button"
                className="flex justify-center items-center bg-red-800 py-2 px-4  text-white rounded text-xs uppercase font-bold"
                onClick={() => handlerDeleteProduct()}
            >
                {/* icono de heroicons.com */}                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>

            </button>
            
        </div>
      </div>
       
    </div>
  )
}


// const YourComponent = () => {
//   return (
    
//       <Card
//         title="Card Title 1"
//         description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
//         imageSrc="https://placekitten.com/300/200"
//       />
//       <Card
//         title="Card Title 2"
//         description="Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
//         imageSrc="https://placekitten.com/300/201"
//       />
     
//   );
// };

