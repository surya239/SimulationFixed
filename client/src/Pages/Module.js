import React,{useEffect, useState} from "react";
import axios from 'axios'
function Module(params) {
    const [modelResource, setModelResource] = useState(0)
    const {WM, WH, lifcycle} = params
    const [resource, setResource] = useState({})
    const getResource = async() => {
        try {
            
            const complex = 'complex'+params.type
            const simple = 'simple'+params.type
            const response = axios.get(`/resource/${complex}/${simple}/${params.type}`)
            const data = (await response).data[0]
            const Resource = (await response).data[1]
            setModelResource(data)
            setResource(Resource)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getResource()
    },[WM, WH, lifcycle])

    return(
        <>
            <tr>
                <td>{params.name}</td>
                <td>{modelResource}</td>
                <td>{resource.requirement}</td>
                <td>{resource.design}</td>
                <td>{resource.coding }</td>
                <td>{resource.testing}</td>
                <td>{resource.deployment}</td>
                <td>{resource.total}</td>

            </tr>
        </>
    )
}

export default Module