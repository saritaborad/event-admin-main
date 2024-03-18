import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../componets/Navbar'
import BotttmNavbar from '../../componets/BotttmNavbar'

const Layout = () => {
  return (
    <div className='mx-auto w-auto h-[95vh] mb-5 max-w-[1024px]'>
        <Navbar/>
        <Outlet/>
        <BotttmNavbar/>
    </div>
  )
}

export default Layout