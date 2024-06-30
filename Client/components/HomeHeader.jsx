import React, { useContext } from 'react';
import { Link, NavLink } from "react-router-dom"
import '../css/Header.css'
import { userContext } from '../components/App';

function HomeHeader() {
    const { user } = useContext(userContext);

    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616",
        textDecorationColor: "rgb(127, 205, 179)"
    };
    return (
        <header className="main-header">
            <Link className="site-logo" to="/home">PhotoLife📸</Link>
            <nav className="nav-header">
                <NavLink
                    to="/home/logout"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Logout
                </NavLink>
                <NavLink
                    to="/home/albums"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Albums
                </NavLink>
                <NavLink
                    to={`/home/users/${user.id}/posts`}
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Posts
                </NavLink>
                <NavLink
                    to={`/home/users/${user.id}/todos`}
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Todos
                </NavLink>
                <NavLink
                    to="/home/info"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Info
                </NavLink>
            </nav>
        </header>
    )
}

export default HomeHeader