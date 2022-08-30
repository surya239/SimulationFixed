import React from "react";
import Select from 'react-select'
import SelectProductivity from "./SelectProductivity";
function Productivity(params){
    const {setUpdate, name} = params
   

    return (
        <>
            <table>
                <thead>
                    <tr className="thead">
                    <th className="firstrow" >Deliverable type</th>

                    <th className="secondrow">Productivity</th>
                    <th className="thirdrow">Effort Per Unit of Deliverable</th>
                    </tr>
                </thead>
                <tbody>
                <tr className="tbody">
                    <td className="firstrow"> 
                        Complex Screen
                    </td>
                    <SelectProductivity name={'complexscreen' } setUpdate = {setUpdate} value={name} />
                </tr>
                <tr className="tbody">
                    <td className="firstrow">
                        Simple Screen
                    </td>
                    <SelectProductivity name={'simplescreen' } setUpdate = {setUpdate} value={name} />
                </tr>
                <tr className="tbody">
                    <td className="firstrow">
                        Complex Database
                    </td>
                    <SelectProductivity name={'complexdatabase' } setUpdate = {setUpdate} value={name} />
                </tr>
                <tr className="tbody">
                    <td className="firstrow">
                        Simple Database
                    </td>
                    <SelectProductivity name={'simpledatabase' } setUpdate = {setUpdate} value={name} />
                </tr>
                <tr className="tbody">
                    <td className="firstrow">Complex Api</td>
                    <SelectProductivity name={'complexapi'} setUpdate = {setUpdate} value={name} />
                </tr>
                <tr className="tbody">
                    <td className="firstrow">Simple Api</td>
                    <SelectProductivity name={'simpleapi'} setUpdate = {setUpdate} value={name} />
                </tr>
               <tr className="tbody">
                    <td className="firstrow">Complex Report</td>
                    <SelectProductivity name={'complexreport'} setUpdate = {setUpdate} value={name} />
                </tr>
                <tr className="tbody">
                    <td className="firstrow">Simple Report</td>
                    <SelectProductivity name={'simplereport'} setUpdate = {setUpdate} value={name} />
                </tr>
            </tbody>
            </table>
            
        </>
    )
}

export default Productivity