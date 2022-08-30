import Recat,{useState,useEffect} from 'react';
import Select from 'react-select'
import axios from 'axios';
import BidPrice from './BidPrice';
import Productivity from './Productivity'
import {useParams, useHistory} from 'react-router-dom'
function Effort(){
    const history = useHistory()
    const [option, setOption] = useState([])
    const [d, setDefaultValue] = useState(0)
    const [update, setUpdate] = useState(0)
    const {name, state} = useParams();
    const [changestate, setChange] = useState(state)
    const getValue = async() => {
        try {
            const result = axios.get(`/adjust/${'abc'}`)
            const data = (await result).data[0]
            const percentage = (await result).data[1]
            let dataArray = []
            for(let i = 0; i< data.length ; i++){
                dataArray[i] = {
                    id:i,
                    value:data[i].percentage,
                    label:String(data[i].percentage)+'%'
                }
            }
            for(let i = 0; i< dataArray.length; i++){
                if(dataArray[i].value === parseInt(percentage[0].effortpercentage)){
                    
                    setDefaultValue(dataArray[i].value)
                    
                }
            }
            
            setOption(dataArray)
        } catch (error) {
            console.log(error)
        }
    }
    const change = async(e) =>{
        const value = e.value
        try {
            const response = axios.post("/changeeffort",{value})
            setChange(!changestate)
            history.push(`/${name}/${changestate}`)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
 getValue()
    },[])

    
    return(
        <>
        <div className="Dash">
            <div className="n">
                <h1>Effort</h1>
            </div>
            <div>
        <BidPrice name={update}/>

            </div>
        </div>
        <div className='effort'>
        <div className='effortChild'>
        <h4>Adjust Effort</h4>
            <label>Estimation Accuracy Level</label>
        
            {d === 0 ? null : <Select options={option}  defaultValue={{id:3, label:d, value:d}}  onChange={(e) => change(e)}  />}
        </div>
        
            <Productivity setUpdate = {setUpdate} name={update}/>
        </div>
            
        </>
    )}

export default Effort