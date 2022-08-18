import React,{useState, useEffect} from "react";
import axios from "axios";
import Select from 'react-select'
import BidPrice from "./BidPrice";
function Infra(){
    const [options,setOptions] = useState([])
    const [defaultValue, setDefaultValue] = useState(0)
    const [cost, setCost] = useState(0)
    const [state, setState] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`/getinfra`)
            let data = []
            for(let i =0; i< (await response).data[0].length ; i++){
                data[i] = {
                    id: 1,
                    label:(await response).data[0][i],
                    value:(await response).data[0][i],
                }
            }
            setOptions(data)
            setDefaultValue((await response).data[1])
            setCost((await response).data[3])
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    }, [state])

    const change = async(e) => {
        try {
            const value = e.value
            const c = 'cost'
            const response = axios.post('/infrachange', {value, c})
            setState(state + 1)
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
        <BidPrice name={state} />
            <table>
                <thead>
                    <tr>
                    <th>infrastructure Cost</th>
                    <th>Total infrastructure Cost</th>
                    </tr>
                    
                </thead>
                <tbody>
                    <tr>
                        <td>
           {defaultValue === 0 ?null: <Select options={options} defaultValue={{id: 0, label: defaultValue, value: defaultValue}} onChange={(e) => change(e)} /> }

                        </td>
                        <td>
                            {cost}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Infra