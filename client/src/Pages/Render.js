import React,{useState} from 'react'
import WBS from './WBS'
import Effort from './Effort'
import Productivity from './Productivity'
import Resource from './Resource'
import ResourceCost from'./ResourceCost';
import Project from './Project'
import Subcontract from './Subcontract'
import Infra from './Infra'
import CostofCapital from './CostofCapital'
import SelectContigency from './SelectContigency'
import BidPrice from './BidPrice'
import Summary from './Summary'
function Render(params){
    const page = params.name
    if(page === ''){
        return <h1>Dash Board</h1>
    }

    if(page === 'WBS'){
        return(
            <>
                <WBS />

            </> )
    }

    else if(page === 'Effort'){
        return(
            <>
                <Effort />
                <Productivity />
            </>
        )
    }

    else if(page === 'Productivity'){
        return <Productivity />
    }

    else if(page === 'Resources'){
        return <Resource />
    }

    else if(page === 'ResourceCost'){
        return <ResourceCost />
    }
    else if(page === 'Project'){
        return <Project />
    }
    else if(page === 'subContract'){
        return <Subcontract />
    }
    else if(page === 'Infra'){
        return <Infra />
    }
    else if(page === 'costOfCapital'){
        return <CostofCapital />
    }
    else if(page === 'Contigency'){
        return <SelectContigency />
    }
    else if(page === 'Summary'){
        return <Summary />
    }
}

export default Render