import React,{useState, useEffect} from "react";
import axios from "axios";
import Select from 'react-select'

function Infra(){
    const [options,setOptions] = useState([])
    const [defaultValue, setDefaultValue] = useState(0)
    const [cost, setCost] = useState(0)
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
    }, [])
    return(
        <>
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
           {defaultValue === 0 ?null: <Select options={options} defaultValue={{id: 0, label: defaultValue, value: defaultValue}} /> }

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