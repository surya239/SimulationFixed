import React, { useState } from "react"
import Select from 'react-select'
import Render from "./Render"
import { useHistory } from "react-router-dom"
function Dashboard(){
const options = [{
    label:'Admin',
    value:'Admin'
},{
    label:"Instructor",
    value:'Instructor'
},{
    label:"Player",
    value:'Player'
}
]

const history = useHistory();

const [page,setPage] = useState('')

const change = (a) =>{
    history.push(`/${a}/${false}`)
}
return(
    <>
        <div className="flex">

            <div className="first">
                {/* <Select options={options} /> */}
                <ul className="styleNone" >
                    <li><button onClick={() => change('WBS')}>WBS</button></li>
                    <li><button onClick={() => change('WBS')}>Quantity</button></li>
                    <li><button onClick={() => change('Effort')}>Effort</button></li>
                    <li><button onClick={() => change('Productivity')}>Productiviy</button></li>
                    <li><button onClick={() => change('Resources')} >Resources</button></li>
                    {/* <li><button onClick={() => change('ResourceCost')} >Resource Cost</button></li> */}
                    <li><button onClick={() => change('Project')}>Project</button></li>
                    <li><button onClick={() => change('subContract')}>Sub contract</button></li>
                    <li><button onClick={() => change('Contigency')} >Contigency</button></li>
                    <li><button onClick={() => change('Infra')} >Infra</button></li>
                    <li><button onClick={() => change("costOfCapital")} >Cost of Capital</button></li>
                    <li><button onClick={() => change('Summary')}>Overhead</button></li>
                    <li><button onClick={() => change('Summary')}>Profit</button></li>
                    <li><button onClick={() => change('Summary')} >Summary</button></li>
                </ul>
            </div>
            <div className="second">
                <Render name = {page} />
            </div>
          
        </div>
    </>
)
}

export default Dashboard