import React from 'react'
import Header from './Header'
import { Outlet } from "react-router-dom"
import '../css/Header.css'

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default Layout