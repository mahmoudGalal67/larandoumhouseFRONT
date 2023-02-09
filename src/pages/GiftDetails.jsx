import React, { useEffect, useState } from 'react'
import "./productDetails.scss"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { fetchFailure, fetchFinish, fetchStart } from '../redux/cartSlice'

import { AiOutlineHeart } from "react-icons/ai"
import {BsBag} from "react-icons/bs"
import Slider from "react-slick";
import axios from "axios"
import {  useLocation, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product'

function GiftDetails() {


  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.cart)
  const navigate = useNavigate()
  

  const location = useLocation()
  const dispatch = useDispatch()
  // const baseURL = "http://localhost:5000"
  const baseURL = "https://larandoumhouseback.onrender.com"
  const id = location.pathname.split("/")[3]
  const bf = "http://localhost:5000/uploads"
  const [gift, setgift] = useState({})
  const [similar, setsimilar] = useState([])
  const [admin, setadmin] = useState(false)

  useEffect(() => {
      const verify = async () => {
        const res = await axios.get(`${baseURL}/admin`, { headers: { verify: user?.verify } })
      setadmin(res.data.verify)
    }
    verify()
  },[user?.verify ,navigate])

  useEffect(() => {
    const getGift = async () => {
      try {
        const productFeed = await axios.get(`${baseURL}/products/gift/${id}`)
        const { data } = await axios.get(`${baseURL}/products/type?type=${productFeed.data.type}`)
        setgift( productFeed.data )
        setsimilar(data)
      }
      catch (err) {
        console.log(err)
    }
    }
    getGift()
  }, [id])

  const addToCart = async () => {
    if(!user) return navigate("/login")
      dispatch(fetchStart())
      await axios.post(`${baseURL}/cart/${user.id}`, { ...gift})
      dispatch(fetchFinish())
      navigate('/cart')
  }
  const settings = {
      infinite: true,
      autoplaySpeed: 2000,
      slidesToShow: similar.length>4 ? 4 : similar.length,
      slidesToScroll: 1,
      // autoplay: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow:similar.length>3 ? 3 : similar.length,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: similar.length>2 ? 2 : similar.length,
            slidesToScroll: 1,
          }
        },
      ]
  };
  const deleteProduct = async (id, type) => {
    if (window.confirm("Are you sure you want to delete  " + gift.title)) {
    dispatch(fetchStart())
    try {
    await axios.delete((`${baseURL}/products/product/${id}?type=${type}`))
    dispatch(fetchFinish())
    navigate("/")
    }
    catch (err) {
      console.log(err)
      dispatch(fetchFailure("Someting went wrong"))
    }
    }
  }
  if(!gift) return
  return (
  <>
    {loading &&
      <div className="flex justify-center items-center absolute top-0 left-0 w-full h-screen bg-overlay">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>}
    <Header />
    <Navbar />
      <div className="product-details m-8">
    <div className='flex av:items-center flex-col av:flex-row text-gray'>
      <div className="left w-full av:w-2/3">
        <div className="image_wrapper flex w-full">
          <div className='w-full px-5'><img className='w-full object-cover' src={`${bf}/${gift.image}`} alt="" /></div>
          </div>
            <p className='av:my-5 text-center mb-2 px-12 text-sm'>{ gift.desc}</p>
      </div>
      <div className="right av:w-1/3 w-full flex flex-col av:items-start items-center av:gap-4 gap-2 px-5">
            <div className='text-lg'>{gift.title}</div>
            <div>{gift.price}</div>
        <div className='text-xs items-center flex gap-5 p-3 border-2 border-green-300 w-fit'><img src={require("../assets/images/details/Group (1).png")} alt="" /> Same Day Delivery Available</div>
        <div className='flex items-center  justify-center gap-5 w-60 border-2 border-black py-2 px-4 bg-gray text-center text-white cursor-pointer hover:scale-110 transition duration-100 ease-in-out' onClick={addToCart}><BsBag /> add to basket</div>
        {/* <div className='flex items-center justify-center  gap-5 w-60 border-2 border-black py-2 px-4 text-center cursor-pointer hover:scale-110 transition duration-100 ease-in-out'><AiOutlineHeart /> Add to favourites</div> */}
        {admin && <div className='p-4 bg-price my-5 text-white cursor-pointer hover:scale-110'  onClick={()=>deleteProduct(gift.id,gift.type)}>Delete</div>}
        <div className='text-xs items-center flex gap-5'><img src={require("../assets/images/details/Group.png")} alt="" /> Free online returns within 14 days</div>
        </div>
      </div>
      <div className="same-category my-12">
        <h3 className='text-2xl text-gray text-center mb-5'>You may also like</h3>
      {
      similar.length &&
        <Slider {...settings}>
        {similar.map((item) => (
          <Product className="category-item w-auto" type='similar' product={item} key={item.id} />
          ))}
        </Slider>
      }
      </div>
      </div>
      <Footer />
    </>
  )
}


export default GiftDetails