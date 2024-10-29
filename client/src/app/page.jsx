"use client"
import { useState } from "react";
import { IoClose } from "react-icons/io5";
function rgbToHex([r, g, b]) {
   return "#" + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
}

export default function Home() {
  let [PrimaryColor,setPrimaryColor]=useState([])
  let [ScondaryColors,setscondaryColors]=useState([])
  let [url,setUrl]=useState('')
  let [image,setImage]=useState(null)
  let [loading,setLoading]=useState(false)

  let handleSelectImage=(e)=>{
    if (e.target.files[0]) {
      let file=e.target.files[0]
      setUrl(URL.createObjectURL(file)) 
      
      setImage(file)
    }
  }
  let  getcolors=async(e)=>{
     setLoading(true)
     e.preventDefault()
     let formDate=new FormData()
     formDate.append('image',image) 
     let  options= {
      method:"POST",
      body:formDate
     } 
     try {
        let req=await fetch('http://localhost:8000/getcolors',options)
        let res=await req.json()
        let {primary_color,scondary_colors}=res
        setPrimaryColor(primary_color)
        setscondaryColors(scondary_colors) 
        

     } catch (error) {
       console.log(error.message);
     } finally{
         setLoading(false)
     }
 }
 let clear=()=>{
    setscondaryColors([])
    setPrimaryColor([])
    setUrl('')
    setImage(null)
 }
 
  return (
    <main style={{backgroundColor:PrimaryColor.length?rgbToHex(PrimaryColor):'white'}} className="home">
        <h1 className="title">Primary Colors Detection</h1>
       <div className="content">
       
        <form className="form" onSubmit={getcolors}>
            <div className="img-frame">
             {!!url.length&& <img src={url} className="img"/>    }
             {!!url.length&&<IoClose 
                          onClick={clear}
                          size={25}
                         className=" absolute top-5 left-5 cursor-pointer rounded-full bg-[#ffffff74] z-40" />   }

            </div>
            {!url.length&&<label htmlFor="select-input" className="select-input-label">Select image</label>}
             <input 
                   id="select-input" 
                   type="file" 
                   className="select-input"
                   accept="image/*" 
                   onChange={handleSelectImage}
                   />
            <button disabled={!url.length||loading} className="send-image-btn">Get Colors</button>
        </form>
        <div className="colors-container" >
          {!!PrimaryColor?.length&&<>
                  <h3 className=" font-bold text-bg text-xl">Primary Color</h3>
                  <div 
                       style={{color:rgbToHex(PrimaryColor)}} 
                       className="color-container">
                          <p  className="index">#1</p>
                           <div className="color">
                                  <div className=" w-4 h-4 rounded-full" 
                                    style={{backgroundColor:rgbToHex(PrimaryColor)}}></div>
                                    <p>{rgbToHex(PrimaryColor)}</p>
                                </div>
                              </div>
                             </>}
         {!!ScondaryColors?.length&&<>
                 <h3 className=" font-bold text-bg text-xl">Scondary Colors</h3>
                  <div className="flex gap-3 flex-wrap">
                   
                      {ScondaryColors.map((el,index)=>{
                        return <div 
                                style={{color:rgbToHex(PrimaryColor)}} 
                                  className="color-container">
                                    <p  className="index">#{index+2}</p>
                                    <div className="color">
                                    <div className=" w-4 h-4 rounded-full" 
                                         style={{backgroundColor:rgbToHex(el)}}></div>
                                   <p style={{color:rgbToHex(el)}}>{rgbToHex(el)}</p>
                              </div>
                           </div>
                      })}
                    </div>
                    </>}                     
        </div>
       </div>
    </main>
  );
}
