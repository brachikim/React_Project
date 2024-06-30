import React, {useEffect, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from '../Pages/Login'
import Register from '../Pages/Register';
import Home from '../Pages/Home';
import Layout from './Layout';
import HomeLayout from './HomeLayout';
import Logout from '../Pages/Logout';
import Albums from '../Pages/Albums';
import Posts from '../Pages/Posts';
import Todos from '../Pages/Todos';
import Info from '../Pages/Info';
import Todo from './Todo';
import Post from './Post';

export const userContext = createContext();

function App() {

  const [user, setUser] = useState()

  return (
    <BrowserRouter>
      <userContext.Provider value={{ user, setUser }}>
        <Routes>

          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/home" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="logout" element={<Logout />} />
            <Route path="albums" element={<Albums />} />
            <Route path="users/:id/posts" element={<Posts />} />
            <Route path="users/:id/todos" element={<Todos />} />
            <Route path="info" element={<Info />} />

            <Route path="users/:id/todos/:id" element={<Todo />} />
            <Route path="users/:id/posts/:id" element={<Post />} />
          </Route>

        </Routes>


      </userContext.Provider>
    </BrowserRouter>
  )
}

export default App