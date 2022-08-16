import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from 'react-select';

function Summary(){
    const [offshore, setOffshore] = useState([])
    const [profit, setProfit] = useState([])
    const [defaultOffshore, setDefaultOffshore] = useState('')
    const [defaultProject, setDefaultProject] = useState('')
    const getValues = async() => {
        try {
            const response = axios.get(`http://localhost:5000/summary`)
            let data = []
            for(let i = 0; i< (await response).data[0].length; i++){
                data[i] = {
                    id:i,
                    label: String((await response).data[0][i])+'%',
                    value: String((await response).data[0][i])+'%'
                }
            }
            setOffshore(data)
            data = []
            for(let i = 0; i< (await response).data[1].length; i++){
                data[i] = {
                    id:i,
                    label: String((await response).data[1][i])+'%',
                    value: String((await response).data[1][i])+'%'
                }
            }
            setProfit(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getValues()
    }, [])

    return(
        <>
            <h4>Overhead Charges</h4>
            {<Select options={offshore} />}
            <h4>Select the expected Profit %</h4>
            {<Select options={profit} />}
        </>
    )
}

export default Summary