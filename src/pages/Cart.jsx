import React, { useEffect } from 'react'
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCart ,setCart} from "../redux/cartSlice"
import { AiFillDelete } from "react-icons/ai"

import "./cart.css"

function Cart() {
  // const bf = "http://localhost:5000/uploads"
  const bf = "https://larandoumhouseback.onrender.com/uploads"
  const { cart } = useSelector((state) => state.cart)
  const {user}= useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const baseURL = "http://localhost:5000"
  const baseURL = "https://larandoumhouseback.onrender.com"

  const totalPrice = cart.reduce((price, item) => {
    return price+item.price
  },0)

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])
  
    useEffect(() => {
    const getCart = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/cart/${user?.id}`)
        dispatch(setCart(data))
      }
      catch (err) {
        console.log(err);
      }
    }
    getCart()
  },[user , dispatch])

  const deleteFromCart = (id , userId) => {
    axios.delete(`${baseURL}/cart/${id}/${userId}`)
    dispatch(deleteCart(id))
  }

  return (
    <div className='min-h-screen  flex justify-between flex-col'>
    <Header />
    <div className='cart mx-12'>
      <h3 className='font-bold text-2xl text-center my-5'>Your shopping bag </h3>
      <div className="cart-wrapper p-5 flex justify-around gap-4 items-center flex-wrap">
      {
        !cart.length ? <div>NO FOUND ITEMS</div> :
        cart.map((item,index) => (
          <div className="cart-item flex-col flex justify-center gap-3 w-60 relative my-5" key={index}>
            <img className='object-cover w-full h-60' src={`${bf}/${item.image}`} alt="" />
            <Link to={item.type==="gifts" ?`/gift/details/${item.productId}` :`/product/details/${item.productId}`}><div  className='text-center'>{item.title}</div></Link>
            <div className='text-center'>{item.price}</div>
            <div className="flex justify-center gap-3">
              <div style={{ backgroundColor: item.color }} className='w-10 h-10 rounded-full'></div><span className='font-bold text-xl'>{item.size}</span>
            </div>
            <AiFillDelete className='text-2xl cursor-pointer text-red absolute bottom-20 opacity-0 right-1' onClick={()=>deleteFromCart(item.id ,user.id)}/>
          </div>
          ))
        }
        </div>
        <div className='font-bold text-center'>Total Price  :{ totalPrice}</div>
        {cart.length>0&&<Link to="/"><div className='w-80 m-auto my-5 text-center p-5 transition-all hover:scale-110 duration-75 ease-in-out bg-black text-white'>Continue to shipping</div></Link>}
      </div>
    <Footer />
    </div>
  )
}

export default Cart