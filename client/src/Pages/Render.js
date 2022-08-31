import React,{useState} from 'react'
import WBS from './WBS'
import Effort from './Effort'
import Productivity from './Productivity'
import Resource from './Resource'
import ResourceCost from'./ResourceCost';
import Project from './Project'
import Subcontract from './Subcontract'
import Infra from './Infra'
import Costofcapital from './Costofcapital'
// import CostofCapital from './CostofCapital'
import SelectContigency from './SelectContigency'
import BidPrice from './BidPrice'
import Summary from './Summary'
import { useParams } from 'react-router-dom'
function Render(){
    const {name} = useParams();
    if(name === '' || name === undefined){
        return (<>
        <div className='Dash'>
            <div className='n'>
                <h1>Dash Board</h1>

            </div>
            <div className='n'>
                <BidPrice />
            </div>
        </div>


        </>
        )
    }

    if(name === 'WBS'){
        return(
            <>
                <WBS />

            </> )
    }

    else if(name === 'Effort'){
        return(
            <>
                <Effort />
              
            </>
        )
    }

    else if(name === 'Productivity'){
        return (
            <>
            <Effort />
            </>
        )
    }

    else if(name === 'Resources'){
        return <Resource />
    }

    else if(name === 'ResourceCost'){
        return <ResourceCost />
    }
    else if(name === 'Project'){
        return <Project />
    }
    else if(name === 'subContract'){
        return <Subcontract />
    }
    else if(name === 'Infra'){
        return <Infra />
    }
    else if(name === 'costOfCapital'){
        return <Costofcapital />
    }
    else if(name === 'Contigency'){
        return <SelectContigency />
    }
    else if(name === 'Summary'){
        return <Summary />
    }
}

export default Render