import React, { useState } from 'react'
import "./navbar.scss"

import Categories from "./Categories"

import {IoMdArrowDropdown} from "react-icons/io"
import { Link} from 'react-router-dom'
  
function Navbar() {
  const navTypes = [["WOMEN","women"],["GIFT","gifts"], ["BEAUTY & FRAGRANCE","gifts"]]
  const navCategories = [{
    categories: ["Coats", "Jackets", "Pants", "Skirts", "Jeans", "Sweat pants", "Bags", "Accessories", "Shoes", "Abaya", "Kaftan","Dresses","Lingerie","Tops"],
    images: [(require("../assets/images/navCategories/women.png")), (require("../assets/images/navCategories/women.png"))]},{
    categories: ["Coats", "Jackets", "Pants", "Tops", "Jeans", "Shoes", "Bags", "Accessories", "Activewear", "Candora"],  
    categories: ["For her", "For him", "it is a boy", "it is a girl", "New Home"],
    images: [(require("../assets/images/navCategories/gifts-for-boyfriends-parents-1-1.png")), (require("../assets/images/navCategories/beauty.png"))]},{
    categories: ["Beauty", "Fragrance"],
    images: [(require("../assets/images/navCategories/Cult-Beauty-The-Fragrance-Discovery-Kit-one-1440x1440.png")), (require("../assets/images/navCategories/makeup-display.png"))]}
  ]
  

  const [categories, setcategories] = useState({})
  const [showcategory, setShowcategory] = useState(false)
  const [width, setwidth] = useState(window.innerWidth)
  const [index, setIndex] = useState(0)
  
  const getCategory = (index) => {
    setShowcategory(true)
    setcategories(navCategories[index])
    setIndex(index)
  }
  window.addEventListener('resize', () => {
      setwidth(window.innerWidth)
  });

  return (
    <div className='navCategory relative'>
        <div className="wrapper flex bg-black md:gap-16 gap-5 text-white lg:px-8 px-4 justify-center"  >
        <div className='py-2 px-2 flex items-center hover:bg-white hover:text-black'>
          <Link to="/">HOME</Link>
        </div>
        {width>= 1010 ?
          navTypes.map((item, index) => (
          <Link to={`/${item[1]}`} key={index} >
          <div className='px-2 py-2 flex items-center gap-4 cursor-pointer hover:bg-white hover:text-black' onMouseEnter={()=>getCategory(index)} onMouseLeave={()=>setShowcategory(false)}>
            {item[0]}<IoMdArrowDropdown/>
          </div></Link>
          )): navTypes.map((item, index) => (
          <div className='flex items-center px-1 gap-4 py-2 cursor-pointer hover:bg-white hover:text-black'  key={index}>
            <Link to={`/${item[1]}`}>{item[0]}</Link>
          </div>
          ))}
        <div className='py-2 px-2 flex items-center hover:bg-white hover:text-black'>
          <Link to="/new">NEW ARRIVAL</Link>
        </div>
      </div> 
      {showcategory && <Categories categories={categories} navTypes={navTypes} number={index} setShowcategory={ setShowcategory} />}
    </div>
  )
}

export default Navbar 