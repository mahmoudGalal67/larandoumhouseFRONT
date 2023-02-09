import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { useSelector } from 'react-redux'

function Dashboard() {
  const baseURL = 'http://localhost:5000'
  const {user}= useSelector((state) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    const verify = async () => {
      const { data } = await axios.get(`${baseURL}/admin`, { headers: { verify: user?.verify } })
      if(!data.verify) navigate("/")
    }
    verify()
  },[user?.verify ,navigate])
  return (
    <div>
      <header className='flex justify-around items-center '>
        <div className="left"><Link to="/"><img className='w-40 h-40' src={require("../assets/logo.png")} alt="" /></Link></div>
        <div className="right font-bold text-2xl av:text-5xl">WELCOME ADMIN</div>
      </header>
      <nav className='flex justify-center items-center text-lg gap-5 av:gap-20 fon-bold av:text-2xl bg-black  text-white'>
        <Link to="/dashboard/addProduct" className='hover:bg-white hover:text-black px-4 py-3'>
          <div className="nav-item">
            Add Product
          </div>
        </Link>
        <Link to="/dashboard/addGift" className='hover:bg-white hover:text-black px-4 py-3'>
          <div className="nav-item">
            Add Gift & Fragrance
          </div>
        </Link>
      </nav>
      <section className='w-full h-80 flex items-center justify-center my-20'>
        <img src={require("../assets/images/header/LRH_preview_rev_1 1.png")} alt="" />
      </section>
    </div>
  )
}

export default Dashboard