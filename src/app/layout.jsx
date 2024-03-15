'use client'
import { ApolloWrapper } from "../lib/apollo-wrapper"
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { usePathname } from 'next/navigation'
import PedidoState from "../context/pedidos/PedidoState";

export default function RootLayout({ children }) {
  const pathname = usePathname()

  return (
    <html lang="es">
      <body>
        {pathname === "/login" || pathname === "/nuevaCuenta" ?
          <>
            <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
              <div>
                <ApolloWrapper>
                  {children}
                </ApolloWrapper>
              </div>
            </div>
          </>
          :
          <div className="bg-gray-200 min-h-screen">
            <div className="sm:flex min-h-screen">
              <Sidebar />
              <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
                <ApolloWrapper>
                  <PedidoState>
                    <Header />
                    {children}
                  </PedidoState>
                </ApolloWrapper>
              </main>
            </div>
          </div>}

      </body>
    </html >
  )
}
