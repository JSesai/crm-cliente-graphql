'use client'
import React, { PureComponent, useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";

const MEJORES_VENDEDORES = gql`
query mejoresVendedores{
  mejoresVendedores {
    vendedor {
      nombre
      email
    }
    total
  }
  
}
`;

export default function page() {

    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_VENDEDORES);
    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    if (loading) return 'cargando...'
    if (error) return `Error! ${error.message}`
//    console.log(data);
    const { mejoresVendedores } = data
    // console.log(mejoresVendedores);
    const vendedorGrafica = []
    mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        }
    } )
    return (
        <>
            <h1>Mejores vendedores</h1>

            <BarChart
                width={600}
                height={400}
                data={vendedorGrafica}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            </BarChart>

        </>
    )
}
