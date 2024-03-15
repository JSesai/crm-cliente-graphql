'use client'
import { useRouter } from 'next/navigation'
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";
import dictionary from '../app/utils/diccionario';

const selectedLanguage = 'es'; 

const OBTENER_USUARIO = gql`
  query obtenerUsuario{
    obtenerUsuario {
      id
      nombre
      apellido      
    }
  }`;

export default function Header() {
  const router = useRouter();
  const { data, loading, error } = useQuery(OBTENER_USUARIO);
  console.log(data);
  console.log(loading);
  console.log(error);

  if (loading) return null;
  if (error) return 'Error';

  //si no hay informacion de usuario redireccionar al login
  if (!data.obtenerUsuario) {
    return router.push('/login');
  }

  const { nombre, apellido } = data.obtenerUsuario;

  const handlerCerrarSesion = () => {
    localStorage.removeItem('token');
    return router.push('/login');
  }

  return (
    <div className="sm:flex sm:justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0"> {dictionary[selectedLanguage].greet} {nombre} {apellido} </p>
      <button type="button"
        onClick={() => handlerCerrarSesion()}
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white"
      >{dictionary[selectedLanguage].exit}</button>
    </div>
  )
}
