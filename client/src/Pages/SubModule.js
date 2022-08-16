import React,{useEffect, useState} from "react";
import axios from "axios";
function SubModule(params){
    const {name} = params
    const [value, setValue] = useState({})
    const getValues = async() => {
        try {
            const response = axios.get(`/getsubcontract/${name}`)
            setValue((await response).data[0])
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    }, [])
    return(
        <>
            <td>{name}</td>
            <td>{value.sub1}{name === 'Riskrating'? null: '%'}</td>
            <td>{value.sub2}{name === 'Riskrating'? null: '%'}</td>
            <td>{value.sub3}{name === 'Riskrating'? null: '%'}</td>
        </>
    )
}

export default SubModule