'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import dictionary, { dictionaryUrls } from "../app/utils/diccionario";

const idioma = 'es'; // Podrías obtenerlo dinámicament



export default function Sidebar() {

   //routing de next
   const pathname = usePathname();
  //  console.log(pathname)
  return (
    <aside className='bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5'>
     <div><p className="text-white text-2xl font-black">CRM- Clientes</p></div> 

     <nav className="mt-5 list-none">
      <ul>
        <li className={pathname === dictionaryUrls.customer ? "bg-blue-800 p-2": "p-2" }>
          <Link href="../" className="text-white block hover:text-gray-200">{dictionary[idioma].customer}</Link>
        </li>
        <li className={pathname === dictionaryUrls.orders ? "bg-blue-800 p-2": "p-2" }>
          <Link href="../pedidos" className="text-white block hover:text-gray-200">{dictionary[idioma].orders}</Link>
        </li>
        <li className={pathname === dictionaryUrls.products ? "bg-blue-800 p-2": "p-2" }>
          <Link href="../productos" className="text-white block  hover:text-gray-200">{dictionary[idioma].products}</Link>
        </li>        
      </ul>
     </nav>

     <div className="sm:mt-10">
      <p className="text-white text-2xl font-black">Otras Opciones</p>

     </div>

     <nav className="mt-5 list-none">
      <ul>
        <li className={pathname === dictionaryUrls.bestCustomers ? "bg-blue-800 p-2": "p-2" }>
          <Link href={dictionaryUrls.bestCustomers} className="text-white block hover:text-gray-200">{dictionary[idioma].bestCustomers}</Link>
        </li>
        <li className={pathname === dictionaryUrls.bestSellers ? "bg-blue-800 p-2": "p-2" }>
          <Link href={dictionaryUrls.bestSellers} className="text-white block hover:text-gray-200">{dictionary[idioma].bestSellers}</Link>
        </li>
              
      </ul>
     </nav>
     
    </aside>
  )
}
