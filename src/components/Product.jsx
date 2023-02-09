import React from 'react'
import { favourite } from '../redux/wishlistSlice'

import { AiOutlineHeart ,AiFillHeart} from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'


const Product = ({ product , type}) => {
  const dispatch = useDispatch()
  const bf = "http://localhost:5000/uploads"
  const baseURL = "http://localhost:5000"
  const { wishlist } = useSelector((state) => state.wishlist)
  const {user}= useSelector((state) => state.auth)
  const isFavourite = wishlist.some((item) => item.id === product.id)
  const setFavourite = async () => {
    dispatch(favourite(product))
    if (!isFavourite) {
      await axios.post(`${baseURL}/wishlist/${user.id}`, { ...product })
    }
    else {
      await axios.delete(`${baseURL}/wishlist/${product.id}/${user.id}`)
      
    }
  }
  return (
    <div className={type==="similar"?'flex justify-center flex-col gap-3 items-center my-4':'flex justify-center flex-col items-center w-60 my-4 mx-5'}>
      <div className='relative'>
        <img className='object-cover w-full h-60' src={`${bf}/${product.image}`} alt="" />
        {isFavourite?<AiFillHeart className='absolute bottom-1 right-3 text-3xl cursor-pointer hover:scale-150 transition-all duration-75 ease-in-out' onClick={setFavourite}/>:
        <AiOutlineHeart className='absolute text-3xl bottom-1 right-3  cursor-pointer hover:scale-105 transition-all duration-75 ease-in-out' onClick={setFavourite}/>}
      </div>
      <Link to={product.type==="gifts" ? `/gift/details/${product.id}` :`/product/details/${product.id}`}><p className='text-bold text-base text-center'>{product.title}</p></Link>
      <div className='font-bold text-base text-fade'><span style={{color:"#B12704"}}>{product.price}</span></div>
    </div>
  )
}

export default Product


