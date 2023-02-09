import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function AddGift() {
  const baseURL = "http://localhost:5000"
  const {user}= useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setprice] = useState(0)
  const [category, setCategory] = useState('')
  const [File, setmainFile] = useState('')
  const [error, seterror] = useState('')
  let image=""

  useEffect(() => {
    const verify = async () => {
      const { data } = await axios.get(`${baseURL}/admin`, { headers: { verify: user?.verify } })
      if(!data.verify) navigate("/")
    }
    verify()
  },[user?.verify ,navigate])
  const addGiftAndFragrance = async (e) => {
    e.preventDefault()
    if (name === "" || desc === "" || price === 0 || category === "" || File === "") {
      seterror("Please add all fields")
    }
    else {
      seterror("")
      setloading(true)
      if (File) {
        const data = new FormData();
        const filename = Date.now() + File.name;
        data.append("name", filename);
        data.append("file", File);
        image = filename
        try {
          await axios.post(`${baseURL}/api/upload`, data);
        } catch (err) {
          console.log(err);
          setloading(false)
        }
      }
      try {
        const { data}=await axios.post(`${baseURL}/products/gifts/add`, { title: name, desc, price, category, image })
        navigate("/gift/details/"+ data)
      }
      catch (err) {
        console.log(err)
      }
    }
  }
  return (
    <>
      <header className='flex justify-around items-center '>
        <div className="left"><Link to="/"><img className='w-40 h-40' src={require("../assets/logo.png")} alt="" /></Link></div>
        <Link to="/dashboard"><div className="right font-bold text-2xl av:text-5xl">WELCOME ADMIN</div></Link>
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
    <div className='w-full p-20 flex justify-center items-center'>
      {loading &&
      <div className="flex justify-center items-center top-0 left-0 w-full h-full bg-overlay fixed">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>}
      <form action="" className='w-full flec flex-col'>
        <h2 className='text-center text-3xl font-bold'>ADD GIFT & FRAGRANCE</h2>
        <div className="form-el my-8 flex flex-col gap-2">
          <label>Name :</label>
          <input className='p-5 border-2 border-black outline-none' type="text"  onChange={(e)=>setName(e.target.value)}/>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Description :</label>
          <textarea  className='p-5 border-2 border-black outline-none' cols="20" rows="10" onChange={(e)=>setDesc(e.target.value)}></textarea>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Price :</label>
          <input className='p-5 border-2 border-black outline-none' type="number"  onChange={(e)=>setprice(Number(e.target.value))}/>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Category : </label>
          <input className='p-5 border-2 border-black outline-none' type="text" placeholder='must as same as the nav category' onChange={(e)=>setCategory(e.target.value.replace(/\s/g, "").toLowerCase())}/>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Main image :</label>
          <input type="file" onChange={(e)=>setmainFile(e.target.files[0])} />
        </div>
        <button type='submit' className='w-full bg-fade p-5 hover:bg-black hover:text-white' onClick={addGiftAndFragrance}>ADD GIFT & FRAGRANCE</button>
        <div className='text-center text-red text-2xl my-5'>{ error}</div>
      </form>
      </div>
    </>
  )
}

export default AddGift