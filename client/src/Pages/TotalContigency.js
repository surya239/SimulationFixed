import React,{useState, useEffect} from "react";
import axios from "axios";

function TotalContigency(){
    const [total, setTotal] = useState(0)
    const getValues = async()=> {
        try {
            const response = axios.get('/totalcontigency')
            setTotal((await response).data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    },[])
    return(
        <>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>total</td>
            <td>{total}</td>
        </>
    )
}

export default TotalContigency