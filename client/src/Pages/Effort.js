import Recat,{useState,useEffect} from 'react';
import Select from 'react-select'
import axios from 'axios';

function Effort(){
    const [option, setOption] = useState([])
    const [d, setDefaultValue] = useState(0)
    const getValue = async() => {
        try {
            const result = axios.get(`http://localhost:5000/adjust/${'abc'}`)
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
            const response = axios.post("http://localhost:5000/changeeffort",{value})
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
 getValue()
    },[])

    return(
        <>
            <h4>Adjust Effort</h4>
            <label>Estimation Accuracy Level</label>
        
            {d === 0 ? null : <Select options={option}  defaultValue={{id:3, label:d, value:d}}  onChange={(e) => change(e)}  />}
        </>
    )
}

export default Effort