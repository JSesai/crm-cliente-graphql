'use client'
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname()

  return (
    <html lang="en">
      <body>
        {pathname === "/login" || pathname ==="/nuevaCuenta" ?
          <>
            <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
              <div>
              {children}
              </div>
            </div>
          </>
          :
          <div className="bg-gray-200 min-h-screen">
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
                {children}
              </main>
            </div>
          </div>}

      </body>
    </html>
  )
}
