'use client'
import React, { PureComponent, useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";

const MEJORES_CLIENTES = gql`
query mejoresClientes{
    mejoresClientes {
      cliente {
        nombre
        email
        empresa
      }
      total
    }
  }
`;

export default function MejoresClientes() {
  const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);

  useEffect(() => {
    startPolling(1000)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])


  if (loading) return 'cargando...'
  if (error) return `Error! ${error.message}`

  // console.log(data);
  const clienteGrafica = []
  data.mejoresClientes.map((cliente, index) => {
    clienteGrafica[index] = {
      ...cliente.cliente[0],
      total: cliente.total
    }
  })
  // console.log(clienteGrafica);
  return (
    <>
      <h1>Mejores Clientes</h1>

      <ResponsiveContainer width={'99%'} height={550}>
        <BarChart
          width={600}
          height={400}
          data={clienteGrafica}
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
      </ResponsiveContainer>

    </>
  )
}
