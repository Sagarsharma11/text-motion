import { useState } from "react"



const useCustomHook = (initVal:number)=>{
    const [count, setCount]= useState(initVal)
    const inc = ()=>{
        setCount((prev)=>prev+1)
    }
    const dec = () =>{
        setCount((prev)=>prev-1)
    }
    return {inc, dec}

}
export default useCustomHook