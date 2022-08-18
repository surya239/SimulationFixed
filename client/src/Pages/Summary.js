import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from 'react-select';

function Summary(){
    const [offshore, setOffshore] = useState([])
    const [profit, setProfit] = useState([])
    const [defaultOffshore, setDefaultOffshore] = useState('')
    const [defaultProject, setDefaultProject] = useState('')
    const [offshorecost, setOffshorecost] = useState(0)
    const [onsite, setOnsite] = useState(0)
    const [infra, setInfra] = useState(0)
    const [subcost, setSubcost] = useState(0)
    const [contigency, setContigency] = useState(0)
    const [project, setProject] = useState(0)
    const [overhead, setOverhead] = useState(0)
    const [financing, setFinancing] = useState(0)
    const [profitCost, setProfitCost] = useState(0)
    const [bidprice, setbidprice] = useState(0)
    const [state, setState] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`/summary`)
            let data = []
            for(let i = 0; i< (await response).data[0].length; i++){
                data[i] = {
                    id:i,
                    label: String((await response).data[0][i])+'%',
                    value: String((await response).data[0][i])
                }
            }
            setOffshore(data)
            data = []
            for(let i = 0; i< (await response).data[1].length; i++){
                data[i] = {
                    id:i,
                    label: String((await response).data[1][i])+'%',
                    value: String((await response).data[1][i])
                }
            }
            setProfit(data)
            setDefaultOffshore((await response).data[2] + '%' )
            setDefaultProject((await response).data[3] + '%')
            setOffshorecost((await response).data[4])
            setOnsite((await response).data[5])
            setInfra((await response).data[6])
            setSubcost((await response).data[7])
            setContigency((await response).data[8])
            setProject((await response).data[9])
            setOverhead((await response).data[10])
            setFinancing((await response).data[11])
            setProfitCost((await response).data[12])
            setbidprice((await response).data[13])
        } catch (error) {
            console.log(error)
        }
    }

    const change = async(e, column) => {
        const value = e.value
        try {
            const response = axios.post('/changebidsummary', {value, column})
            setState(state + 1)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getValues()
    }, [state])

    return(
        <>
            <h4>Overhead Charges</h4>
            {defaultOffshore === ''? null: <Select options={offshore} defaultValue={{id: 0, label: defaultOffshore , value:defaultOffshore }}  onChange={(e) => change(e, 'overhead')} />}
            <h4>Select the expected Profit %</h4>
            {defaultProject === '' ? null: <Select options={profit} defaultValue={{id: 0, label: defaultProject, value: defaultProject}} onChange={(e) => change(e, 'expectedprofit')} />}
            <table>
                <thead>
                    <tr>
                    <th>Cost Component</th>
                    <th>Cost in USD</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Offshore Cost</td>
                        <td>{offshorecost}</td>
                    </tr>
                    <tr>
                        <td>Onsite Cost</td>
                        <td>{onsite}</td>
                    </tr>
                    <tr>
                        <td>Infrastructure cost</td>
                        <td>{infra}</td>
                    </tr>
                    <tr>
                        <td>Sub -contract</td>
                        <td>{subcost}</td>
                    </tr>
                    <tr>
                        <td>Contigency Cost</td>
                        <td>{contigency}</td>
                    </tr>
                    <tr>
                        <td>Project Management cost</td>
                        <td>{project}</td>
                    </tr>
                    <tr>
                        <td>Overhead Cost</td>
                        <td>{overhead}</td>
                    </tr>
                    <tr>
                        <td>Financing Cost</td>
                        <td>{financing}</td>
                    </tr>
                    <tr>
                        <td>Profit</td>
                        <td>{ Math.round(profitCost)}</td>
                    </tr>
                    <tr>
                        <td>BID Price</td>
                        <td>{Math.round(bidprice)}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Summary