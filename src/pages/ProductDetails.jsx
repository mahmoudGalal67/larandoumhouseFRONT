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



function ProductDetails() {
  const { user } = useSelector((state) => state.auth)
  const { loading ,error} = useSelector((state) => state.cart)
  const navigate = useNavigate()
  
  
  const location = useLocation()
  const dispatch = useDispatch()
  // const baseURL = "http://localhost:5000"
  const baseURL = "https://larandoumhouseback.onrender.com"
  const id = location.pathname.split("/")[3]
  const bf = "http://localhost:5000/uploads"
  const [product, setproduct] = useState({})
  const [similar, setsimilar] = useState([])
  const [imageIndex, setimageIndex] = useState(0)
  const [choosenColor, setchoosenColor] = useState('')
  const [choosenSize, setchoosenSize] = useState('')
  const [admin, setadmin] = useState(false)
  const [sizeGuide, setsizeGuide] = useState('')
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

  useEffect(() => {
      const verify = async () => {
        const res = await axios.get(`${baseURL}/admin`, { headers: { verify: user?.verify } })
      setadmin(res.data.verify)
    }
    verify()
  },[user?.verify ,navigate])

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productFeed = await axios.get(`${baseURL}/products/product/${id}`)
        const colorsFeed = await axios.get(`${baseURL}/products/colors/${id}`)
        const imagesFeed = await axios.get(`${baseURL}/products/images/${id}`)
        const sizesFeed = await axios.get(`${baseURL}/products/sizes/${id}`)
        const { data } = await axios.get(`${baseURL}/products/category?type=${productFeed.data.type}&category=${productFeed.data.category}`)
        setproduct({ product: productFeed.data, colors: colorsFeed.data, images: imagesFeed.data, sizes: sizesFeed.data })
        setsimilar(data)
      }
      catch (err) {
        console.log(err)
    }
    }
    getProduct()
  }, [id])

  

  const setColor = (index , color) => {
    setimageIndex(index * 2)
    setchoosenColor(color)
  }
  const colorInputStyle = (color) => {
    return {
      backgroundColor: color.color,
      transform : choosenColor===color.color ? "scale(1.2)" :"scale(1)"
    }
  }
  const sizeInputStyle = (size) => {
    return {
      backgroundColor: size === choosenSize ? "black" : "white",
      color :size === choosenSize ? "white" : "black" 
    }
  }
  const addToCart = async () => {
    if(!user) return navigate("/login")
    if (choosenColor !== '' && choosenSize !== '') {
      dispatch(fetchStart())
      await axios.post(`${baseURL}/cart/${user.id}`, { ...product.product, color: choosenColor, size: choosenSize })
      dispatch(fetchFinish())
      navigate('/cart')
    }
    else {
      dispatch(fetchFailure("Please choose the color and the size"))
    }
  }
  const deleteProduct = async (id, type) => {
    if (window.confirm("Are you sure you want to delete  " + product.product.title)) {
    dispatch(fetchStart())
    try {
    await axios.delete((`${baseURL}/products/product/${id}?type=${type}`))
    await axios.delete((`${baseURL}/products/colors/${id}?type=${type}`))
    await axios.delete((`${baseURL}/products/sizes/${id}?type=${type}`))
    await axios.delete((`${baseURL}/products/images/${id}?type=${type}`))
    await axios.delete((`${baseURL}/cart/${id}`))
    await axios.delete((`${baseURL}/wishlist/${id}`))
    dispatch(fetchFinish())
    navigate("/")
    }
    catch (err) {
      console.log(err)
      dispatch(fetchFailure("Someting went wrong"))
    }
    }
  }
  if(!product.product) return
  return (
  <>
    {loading &&
      <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-overlay">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>}
    <Header />
    <Navbar />
      <div className="product-details m-8">
    <div className='flex av:items-center flex-col av:flex-row text-gray'>
      <div className="left w-full av:w-2/3">
        <div className="image_wrapper flex w-full">
          <div className='w-1/2 px-5'><img className='w-full object-cover  h-80' src={`${bf}/${product.images[imageIndex].image}`} alt="" /></div>
            <div className='w-1/2 px-5'><img className='w-full object-cover h-80' src={`${bf}/${product.images[imageIndex+1].image}`} alt="" /></div>
          </div>
            <p className='av:my-5 text-center mb-2 px-12 text-lg'>{ product.product.desc}</p>
      </div>
      <div className="right av:w-1/3 w-full flex flex-col av:items-start items-center av:gap-4 gap-2 px-5">
            <div className='text-lg'>{product.product.title}</div>
            <div>{product.product.price}</div>
        <div className='text-xs items-center flex gap-5 p-3 border-2 border-green-300 w-fit'><img src={require("../assets/images/details/Group (1).png")} alt="" /> Same Day Delivery Available</div>
        <div className="colors flex gap-3">
          {product.colors.map((color,index) => (
            <div className='cursor-pointer w-7 h-7 color-active' style={colorInputStyle(color)} key={color.id} onClick={()=>setColor(index,color.color)}></div>
          ))}
        </div>
            <div className='text-fade self-end mr-5 cursor-pointer' onClick={()=>setsizeGuide(product.product.type)}>Size Guide</div>
            {sizeGuide==="kids"&&<div className='flex justify-center items-center fixed w-screen h-screen top-0 left-0 z-10 bg-fade'><div className='relative'><img className='w-300' src={require('../assets/images/details/children-size.jpeg')} alt="" /><span className='absolute top-2 right-5 font-bold md:text-4xl text-lg cursor-pointer  bg-black text-white w-10 h-10 flex justify-center items-center hover:text-black hover:bg-white rounded-full' onClick={()=>setsizeGuide("")}>X</span></div></div>}
            {sizeGuide==="women"&&<div className='flex justify-center items-center fixed w-screen h-screen top-0 left-0 z-10 bg-fade'><div className='relative'><img className=''  src={require('../assets/images/details/size-women.png')} alt="" /><span className='absolute top-2 right-5 font-bold md:text-4xl text-lg cursor-pointer bg-black text-white w-10 h-10 flex justify-center items-center hover:text-black hover:bg-white rounded-full' onClick={()=>setsizeGuide("")}>X</span></div></div>}
            {sizeGuide==="men"&&<div className='flex justify-center items-center fixed w-screen h-screen top-0 left-0 z-10 bg-fade'><div className='relative'><img  className='w-300 ' src={require('../assets/images/details/men-size.jpeg')} alt="" /><span className='absolute top-2 right-5 font-bold md:text-4xl text-lg cursor-pointer  bg-black text-white w-10 h-10 flex justify-center items-center hover:text-black hover:bg-white rounded-full' onClick={()=>setsizeGuide("")}>X</span></div></div>}
            <div className='sizes flex gap-4'>
              {product.sizes.map((size) => (
                <div className='flex cursor-pointer justify-center items-center border-2 borde-fade w-10 h-10' key={size.id} style={sizeInputStyle(size.size)} onClick={()=>setchoosenSize(size.size)}>{size.size}</div>
            ))}
            </div>
            {error && <div className='text-red text-center'>{ error}</div>}
        <div className='flex items-center  justify-center gap-5 w-60 border-2 border-black py-2 px-4 bg-gray text-center text-white cursor-pointer hover:scale-110 transition duration-100 ease-in-out' onClick={addToCart}><BsBag /> add to basket</div>
        {/* <div className='flex items-center justify-center  gap-5 w-60 border-2 border-black py-2 px-4 text-center cursor-pointer hover:scale-110 transition duration-100 ease-in-out'><AiOutlineHeart /> Add to favourites</div> */}
        {admin && <div className='p-4 bg-price my-5 text-white cursor-pointer hover:scale-110'  onClick={()=>deleteProduct(product.product.id,product.product.type)}>Delete</div>}
        <div className='text-xs items-center flex gap-5'><img src={require("../assets/images/details/Group.png")} alt="" /> Free online returns within 14 days</div>
        </div>
      </div>
      <div className="same-category my-12">
        <h3 className='text-2xl text-gray text-center mb-5'>You may also like</h3>
        <Slider {...settings}>
        {similar.map((item) => (
          <div className='p-5' key={item.id}>
            <Product className="category-item w-auto" type='similar' product={item} />
          </div>
          ))}
        </Slider>
      </div>
      </div>
      <Footer />
    </>
  )
}

export default ProductDetails