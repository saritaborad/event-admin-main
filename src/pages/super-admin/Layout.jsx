import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../componets/Navbar'
import BotttmNavbar from '../../componets/BotttmNavbar'

const Layout = () => {
  return (
    <div className='mx-auto w-auto mainBg bg-blue-200 h-auto md:w-full md:m-0'>
        <Navbar/>
        <Outlet/>
        <BotttmNavbar/>
    </div>
  )
}

export default Layout