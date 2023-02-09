import React, { useEffect, useState } from 'react' 

import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


function AddProduct() {
  const baseURL = "http://localhost:5000"
  const {user}= useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setprice] = useState(0)
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [mainFile, setmainFile] = useState('')
  const [sizes, setsizes] = useState([])
  const [color, setcolor] = useState('')
  const [colors, setcolors] = useState([])
  const [files, setfiles] = useState([])
  let image=""
  let images=[]
  const [colorError, setcolorError] = useState('')
  const [error, seterror] = useState('')

    useEffect(() => {
    const verify = async () => {
      const { data } = await axios.get(`${baseURL}/admin`, { headers: { verify: user?.verify } })
      if(!data.verify) navigate("/")
    }
    verify()
  },[user?.verify ,navigate])

  const addColor = () => {
    if (color === "") {
      return setcolorError("please choose a color")
    }
    setcolors((prev) => [...prev, color])
    setcolorError("")
  }

  const addProduct = async (e) => {
    e.preventDefault()
    if (name === "" || desc === "" || price === 0 || type === "" || category === "" || mainFile === "" || !sizes.length|| color === "" || !colors.length|| !files.length ) {
      seterror("Please add all fields")
    } 
    else {
      seterror("")
      setloading(true)
      if (mainFile) {
      const data =new FormData();
      const filename = Date.now() + mainFile.name;
      data.append("name", filename);
      data.append("file", mainFile);
      image=filename
      try {
        await axios.post(`${baseURL}/api/upload`, data);
      } catch (err) {
        console.log(err);
        setloading(false)
      }
    }
      if (files) {
      await Promise.all(Object.values(files).map(async(file) => {
      const data =new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      images.push(filename)
        try {        
        await axios.post(`${baseURL}/api/upload`, data);
      } catch (err) {
          console.log(err);
          setloading(false)
      }
      }))
      }
      try {
        const { data } = await axios.post(`${baseURL}/products/add`, { title: name, desc, price, type, category, image })
        await Promise.all(colors.map(async(color) => {
          try {
            await axios.post(`${baseURL}/products/colors/add`,{color,productId:data})
          }
          catch (err) {
            console.log(err);
            setloading(false)
          }
        }))
        await Promise.all(sizes.map(async(size) => {
          try {
            await axios.post(`${baseURL}/products/sizes/add`,{size,productId:data})
          }
          catch (err) {
            console.log(err);
            setloading(false)
          }
        }))
        await Promise.all(images.map(async(image) => {
          try {
            await axios.post(`${baseURL}/products/images/add`, { image, productId: data })
            setloading(false)
            navigate("/product/details/"+ data)
          }
          catch (err) {
            console.log(err);
            setloading(false)
          }
        }))
      }
    catch (err) {
      console.log(err)
    }
    }
  }
  const removeColor = (index) => {
    setcolors((prev) =>prev.filter((el)=>el !==prev[index]))
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
      <form  className='w-full flec flex-col' onSubmit={addProduct}  method="POST" >
        <h2 className='text-center text-3xl font-bold'>ADD PRODUCT</h2>
        <div className="form-el my-8 flex flex-col gap-2">
          <label>Name :</label>
          <input className='p-5 border-2 border-black outline-none' type="text"  onChange={(e)=>setName(e.target.value)}/>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Description :</label>
          <textarea  className='p-5 border-2 border-black outline-none' cols="20" rows="10"  onChange={(e)=>setDesc(e.target.value)}></textarea>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Price :</label>
          <input className='p-5 border-2 border-black outline-none' type="number"   onChange={(e)=>setprice(e.target.value)}/>
        </div>
        <div className="form-el my-8 w-full">
          <select className='p-3 border-2  w-full '  onChange={(e)=>setType(e.target.value)}>
            <option disabled>Choose the type</option>
            <option className='p-3' value="women" >WOMEN</option>
            <option className='p-3' value="men" >MEN</option>
            <option className='p-3'  value="kids" >KIDS</option>
          </select>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Category : </label>
          <input className='p-5 border-2 border-black outline-none' type="text" placeholder='must as same as the nav category'  onChange={(e)=>setCategory(e.target.value.replace(/\s/g, "").toLowerCase())}/>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Main image :</label>
          <input type="file" onChange={(e)=>setmainFile(e.target.files[0])}/>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Add sizes :</label>
          <div className="wrapper flex gap-8  items-center"><input className='p-2 border-2 border-black outline-none' type="text" placeholder='Separated with , ' onChange={(e)=>setsizes(e.target.value.toUpperCase().split(","))}/></div>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Add colors :</label>
          <div className="wrapper flex gap-8 items-center"><input className='p-5 border-2 border-black outline-none' type="color" onChange={(e)=>setcolor(e.target.value)}/><div className='p-3 bg-black text-white cursor-pointer' onClick={addColor}>Add</div></div>
          <div className='colors-wrapper flex gap-4'>
            {
              colors.map((color,index) => (
                <div className='w-10 h-10 my-5 cursor-pointer' style={{backgroundColor:color}} key={index} onClick={()=>removeColor(index)}></div>
              ))
            }
          </div>
          <div className='text-price text-2xl'>{ colorError}</div>
        </div>
        <div className="form-el my-8  flex flex-col gap-2">
          <label>Colorful images : <span className='text-fade mx-3'>must be the double of the colors</span></label>
          <input type="file"  multiple  onChange={(e)=>setfiles(e.target.files)}/>
        </div>
        <button type='submit' className='w-full bg-fade p-5 hover:bg-black hover:text-white'>ADD PRODUCT</button>
        <div className='text-center text-red text-2xl my-5'>{ error}</div>
      </form>
      </div>
    </>
  )
}

export default AddProduct