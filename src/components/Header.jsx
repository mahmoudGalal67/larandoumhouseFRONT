import React from 'react'
import "./header.scss"
import { FaUserCircle } from "react-icons/fa"
import { AiOutlineHeart , AiOutlineLogout} from "react-icons/ai"
import { BsBag } from "react-icons/bs"
import {RxDashboard} from "react-icons/rx"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { logout } from '../redux/authSlice' 

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)
  
  const removeUser = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <div className='header'>
    <div className="md:px-8 md:py-4 flex justify-between">
      <div className="left w-1/2 lg:w-4/5">
        <Link to="/"><img className='lg:m-auto' src={require("../assets/images/header/LRH_preview_rev_1 1.png")} alt="" /></Link>
      </div>
      <div className="right w-1/2 lg:w-1/5 flex items-center mr-3">
          <div className="header-icons flex items-center gap-5 justify-end w-full">
          {!user ? <Link to="/login"><FaUserCircle /></Link> : <AiOutlineLogout className='cursor-pointer hover:text-link' onClick={removeUser}/>}
          <Link to='/wishlist'><AiOutlineHeart/></Link>
            <div className="cart relative">
              <Link to='/cart'><BsBag /></Link>
              {cart.length>0 &&<span className='cart-count'>{cart.length}</span>}
            </div>
            {user?.verify&&<Link to="/dashboard"><RxDashboard/></Link>}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Header