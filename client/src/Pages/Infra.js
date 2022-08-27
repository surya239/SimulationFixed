import React,{useState, useEffect} from "react";
import axios from "axios";
import Select from 'react-select'
import BidPrice from "./BidPrice";
function Infra(){
    const [options,setOptions] = useState([])
    const [defaultValue, setDefaultValue] = useState(0)
    const [cost, setCost] = useState(0)
    const [update, setUpdate] = useState(0)
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
    }, [update])

    const change = async(e) => {
        try {
            const value = e.value
            const c = 'cost'
            const response = axios.post('/infrachange', {value, c})
            setUpdate(update + 1)
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
        <div className='Dash'>
            <div className='n'>
                <h1>Infrastructure Cost</h1>

            </div>
            <div className='n'>
                <BidPrice name={update} />
            </div>
        </div>
        {/* <BidPrice name={update} /> */}
        <div className="effort">
            <table>
                <thead>
                    <tr className="thead">
                    <th className="thirdrow">infrastructure Cost</th>
                    <th className="thirdrow">Total infrastructure Cost</th>
                    </tr>
                    
                </thead>
                <tbody>
                    <tr className="tbody">
                        <td className="thirdrow">
           {defaultValue === 0 ?null: <Select options={options} defaultValue={{id: 0, label: defaultValue, value: defaultValue}} onChange={(e) => change(e)} /> }

                        </td>
                        <td className="thirdrow">
                            {cost}
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </>
    )
}

export default Infra