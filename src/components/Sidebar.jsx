'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation'


export default function Sidebar() {
  //routing de next
   const pathname = usePathname();
  //  console.log(pathname)
  return (
    <aside className='bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5'>
     <div><p className="text-white text-2xl font-black">CRM- Clientes</p></div> 

     <nav className="mt-5 list-none">
      <ul>
        <li className={pathname === "/" ? "bg-blue-800 p-2": "p-2" }>
          <Link href="../" className="text-white block hover:text-gray-200">Clientes</Link>
        </li>
        <li className={pathname === "/pedidos" ? "bg-blue-800 p-2": "p-2" }>
          <Link href="../pedidos" className="text-white block hover:text-gray-200">Pedidos</Link>
        </li>
        <li className={pathname === "/productos" ? "bg-blue-800 p-2": "p-2" }>
          <Link href="../productos" className="text-white block  hover:text-gray-200">Productos</Link>
        </li>       
        {/* <li>
          <Link href="#" className="text-white block hover:text-gray-200">Tareas</Link>
        </li>
        <li>
          <Link href="#" className="text-white block hover:text-gray-200">Cerrar Sesion</Link>
        </li>
         */}
      </ul>
     </nav>
     
    </aside>
  )
}
