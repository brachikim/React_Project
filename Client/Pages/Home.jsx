import React, { useContext } from 'react'
import { userContext } from '../components/App';
import '../css/Home.css'

function Home() {
  const { user, setUser } = useContext(userContext);
  return (
    <div>
      <h1 className='userName'>{`Hello ${user.name}`} </h1>
    </div>
  )
}

export default Home