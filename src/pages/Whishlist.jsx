import React, { useEffect } from 'react'
import Header from "../components/Header"
import Footer from "../components/Footer"
import {setWishlist , deleteWishlist} from "../redux/wishlistSlice"

import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {  Link, useNavigate } from 'react-router-dom'
import { AiFillDelete } from "react-icons/ai"

function Wishlist() {
  const bf = "http://localhost:5000/uploads"
  const {user}= useSelector((state) => state.auth)
  const {wishlist}= useSelector((state) => state.wishlist)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const baseURL = "http://localhost:5000"
  const baseURL = "https://larandoumhouseback.onrender.com"
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  },[user , navigate])

  useEffect(() => {
    const getWishlist = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/wishlist/${user?.id}`)
        dispatch(setWishlist(data))
      }
      catch (err) {
        console.log(err);
      }
    }
    getWishlist()
  },[user , dispatch])

  const deleteFromWishlist = (id , userId) => {
    axios.delete(`${baseURL}/wishlist/${id}/${userId}`)
    dispatch(deleteWishlist(id))
  }
  return (
  <div className='min-h-screen flex justify-between flex-col'>
    <Header />
      <div className='cart mx-12'>
        <div className='flex flex-col gap-3 justify-center'>
          <h3 className='font-bold text-3xl text-center'>My Wishlist</h3>
          <p className='text-center text-fade'>Personalize your shopping experience with your Wishlist.</p>
          <div className='h-px text-mute w-full bg-fade my-5'></div>
        </div>
          <div className='flex flex-col gap-3'>
          <h3 className='font-bold text-3xl' >Heart It.</h3>
          <div className=' text-fade'>Store everything you love on one page.</div>
          <p className=' text-gray'>Think about it before purchasing it.</p>
          <div className='text-gray'> Get notification about out-of-stock items.</div>
          <div className="cart-wrapper p-5 flex justify-around gap-4 items-center flex-wrap">
          {!wishlist.length ? <div >NO FOUND ITEMS</div> :
            wishlist.map((item) => (
          <div className="cart-item w-60 flex-col flex justify-center gap-3 relative" key={item.id}>
          <img className='object-cover w-full h-60' src={`${bf}/${item.image}`} alt="" />
          <Link to={item.type==="gifts" ?`/gift/details/${item.id}` :`/product/details/${item.id}`}><div  className='text-center'>{item.title}</div></Link>
              <div className='text-center'>{item.price}</div>
              <AiFillDelete className='text-2xl cursor-pointer text-red absolute bottom-20 opacity-0 right-1' onClick={()=>deleteFromWishlist(item.id ,user.id)}/>
          </div>
          ))}
        </div>
        </div>
      </div>
    <Footer />
  </div>
  )
}

export default Wishlist

