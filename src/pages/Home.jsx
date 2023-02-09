import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { setCart } from "../redux/cartSlice"


import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Home() {
  // const baseURL = "http://localhost:5000"
  const baseURL = "https://larandoumhouseback.onrender.com"
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const settings = {
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
  };
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
  return (
    <div className="Home overflow-x-hidden">
      <Header />
      <Navbar />
      <header>
        <Slider {...settings}>
          <img src={require("../assets/images/Home/new collection/01.jpg")} alt="" />
          <img src={require("../assets/images/Home/new collection/02.jpg")} alt="" />
          <img src={require("../assets/images/Home/new collection/03.jpg")} alt="" />
          <img src={require("../assets/images/Home/new collection/04.jpg")} alt="" />
          <img src={require("../assets/images/Home/new collection/05.jpg")} alt="" />
        </Slider>
        <h2 className="text-center my-3 md:my-7 font-bold text-lg md:text-3xl">SHOP BY CATEGORY</h2>
        <Link to="/women"><img src={require("../assets/images/Home/categories/01.jpg")} alt="" /></Link>
        <Link to="/men"><img src={require("../assets/images/Home/categories/02.jpg")} alt="" /></Link>
        <Link to="/kids"><img src={require("../assets/images/Home/categories/03.jpg")} alt="" /></Link>
        <Link to="/gifts"><img src={require("../assets/images/Home/categories/04.jpg")} alt="" /></Link>
        <Link to="/new"><img src={require("../assets/images/Home/categories/05.jpg")} alt="" /></Link>
        <Slider {...settings}>
          <img src={require("../assets/images/Home/shop this look/01.jpg")} alt="" />
          <img src={require("../assets/images/Home/shop this look/02.jpg")} alt="" />
          <img src={require("../assets/images/Home/shop this look/03.jpg")} alt="" />
          <img src={require("../assets/images/Home/shop this look/04.jpg")} alt="" />
          <img src={require("../assets/images/Home/shop this look/05.jpg")} alt="" />
        </Slider>
      </header>
      <Footer />
    </div>
  )
}

export default Home