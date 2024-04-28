'use client'

import * as React from 'react';
import { useState, useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from 'next/link';

const API_ENDPOINT = process.env.API_ENDPOINT

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    })
    
    const categoriesPromise = fetch(`${API_ENDPOINT}/categories`, { headers })
    const trendsPromise = fetch(`${API_ENDPOINT}/trends`, { headers })
    
    Promise.all([categoriesPromise, trendsPromise])
      .then(response => Promise.all(response.map(i => i.json())))
      .then((json: any[]) => {
        const categories: Category[] = json[0].data
        const trends: Trend[] = json[1].data

        return fetch(`${API_ENDPOINT}/products?size=10&page=0`, { headers })
        .then(response => response.json())
        .then(raw => {
          return raw.data.content.map((item: any) => {
            return {
              code: item.code,
              name: item.name,
              price: item.price,
              trend: trends.find(trend => trend.id == item.trendId) ?? {} as Trend,
              category: categories.find(category => category.id == item.categoryId) ?? {} as Category,
              skus: item.skus
            } as Product
          })
        })
      })
      .then(data => setProducts(data))
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product: any) => (
            <TableRow
              key={product.code}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Link href={{
                  pathname: `/product/${product.id}`,
                }}>
                {product.name}
                </Link>
              </TableCell>
              <TableCell align="right">
                {product.price}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
