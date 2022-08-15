import React,{useEffect, useState} from "react";
import axios from "axios";

function BidPrice(params){
    const {name} = params
    console.log(name)
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
    },[name])
    return(
        <>
            <h4>Bid Price</h4>
            <h5>{bidPrice}</h5>
        </>
    )
}

export default BidPrice