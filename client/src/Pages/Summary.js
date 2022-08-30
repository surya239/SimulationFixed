import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from 'react-select';
import BidPrice from "./BidPrice";
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
            setOnsite((await response).data[7])
            setInfra((await response).data[6])
            setSubcost((await response).data[5])
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
        <div className='Dash'>
            <div className='n'>
                <h1>Summary</h1>

            </div>
            <div className='n'>
                <BidPrice name={state} />
            </div>
        </div>
        <div className="effort">
            <div className="effortchild">
            <h4>Overhead Charges</h4>
            {defaultOffshore === ''? null: <Select options={offshore} defaultValue={{id: 0, label: defaultOffshore , value:defaultOffshore }}  onChange={(e) => change(e, 'overhead')} />}
            <h4>Select the expected Profit %</h4>
            {defaultProject === '' ? null: <Select options={profit} defaultValue={{id: 0, label: defaultProject, value: defaultProject}} onChange={(e) => change(e, 'expectedprofit')} />}
            </div>
            
            <table>
                <thead>
                    <tr className="thead">
                    <th className="thirdrow">Cost Component</th>
                    <th className="subsecond">Cost in USD</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="tbody">
                        <td className="thirdrow">Offshore Cost</td>
                        <td className="subsecond">{offshorecost}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">Onsite Cost</td>
                        <td className="subsecond">{onsite}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">Infrastructure cost</td>
                        <td className="subsecond">{infra}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">Sub -contract</td>
                        <td className="subsecond">{subcost}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">Contigency Cost</td>
                        <td className="subsecond">{contigency}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">Project Management cost</td>
                        <td className="subsecond">{project}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">Overhead Cost</td>
                        <td className="subsecond">{Math.round(overhead)}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">Financing Cost</td>
                        <td className="subsecond">{financing}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">Profit</td>
                        <td className="subsecond">{ Math.round(profitCost)}</td>
                    </tr>
                    <tr className="tbody">
                        <td className="thirdrow">BID Price</td>
                        <td className="subsecond">{Math.round(bidprice)}</td>
                    </tr>
                </tbody>
            </table>

            </div>
        </>
    )
}

export default Summary