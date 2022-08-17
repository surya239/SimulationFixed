import React,{useEffect, useState} from "react";
import axios from "axios";

function Risk(params){
    const {name} = params
    const [risk, setRisk] = useState('')
    const [cost, setCost] = useState(0)
    const [scost, setSCost] = useState(0)
    const [total, setTotal] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`/getriskrating/${name}`)
            console.log((await response).data)
            setRisk((await response).data[0])
            setCost((await response).data[1])
            setSCost((await response).data[2])
            setTotal((await response).data[3])
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    }, [params.state])
    return(
        <>
            <td>{risk}</td>
            <td>{cost}</td>
            <td>{scost}</td>
            <td>{total}</td>
        </>
    )
}

export default Risk