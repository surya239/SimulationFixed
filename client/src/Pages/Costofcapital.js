import React, { useState, useEffect } from "react";
import Select from 'react-select';
import axios from "axios";
import BidPrice from "./BidPrice";
function Costofcapital(){
    const [option, setOption] = useState([])
    const [cost, setCost] = useState(0)
    const [financeCost, setFinanaceCost] = useState(0)
    const [update, setUpdate] = useState(0)
    const getValues = async() => {
        try {
            const result = axios.get(`/getcostofcapital`)
            let data = []
            for(let i =0; i<((await result)).data[1].length; i++){
                data[i] = {
                    id: i,
                    value: (await result).data[1][i],
                    label: String((await result).data[1][i]) + '%'
                }
                
            }
            setOption(data);
            console.log((await result).data[0])
            const l = (await result).data[0]
            setCost(l)
            setFinanaceCost((await result).data[2])
        } catch (error) {
            console.log(error)
        }
    }
    const change = async(e) => {
        try {
            const value = e.value
            
            const response = axios.post('/changecostofcapital', {value})
            setUpdate(update + 1)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues();
    },[update])
    return(
        <>
                <div className='Dash'>
            <div className='n'>
                <h1>Infrastructure Cost</h1>

            </div>
            <div className='n'>
                <BidPrice name = {update} />
            </div>
        </div>
            
            
            <div className="effort">
            <table>
                <thead>
                    <tr className="thead">
                    <th className="thirdrow">Cost of Capital</th>
                    <th className="thirdrow">Total Finance Cost</th>
                    </tr>
                    
                </thead>
                <tbody>
                    <tr className="tbody">
                        <td className="thirdrow">
                        
                {cost === 0 ? null: <Select options={option} defaultValue={{id: 0, value: cost, label: String(cost) + '%'}} onChange={(e) => change(e)} />}
            

                        </td>
                        <td className="thirdrow">
                            {financeCost}
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </>
    )
}

export default Costofcapital