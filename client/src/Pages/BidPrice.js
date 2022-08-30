import React,{useEffect, useState} from "react";
import axios from "axios";
import {useParams} from 'react-router-dom'
function BidPrice(params){
    const {name} = params
    const {state} = useParams()
    console.log(params)
    console.log(state)
    const [bidPrice, setBidPrice] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`/getbid/${'abc@gmail.com'}`)
            setBidPrice((await response).data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    },[state])
    return(
        <>
            <h4>Bid Price</h4>
            <h5>{bidPrice}</h5>
        </>
    )
}

export default BidPrice