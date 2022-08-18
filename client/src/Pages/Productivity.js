import React from "react";
import Select from 'react-select'
import SelectProductivity from "./SelectProductivity";
function Productivity(params){
    const {state, name} = params
    const changeval = (val) => {
        state(val)
        console.log(val)
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                    <th>Deliverable type</th>

                    <th>Productivity</th>
                    <th>Effort Per Unit of Deliverable</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        Complex Screen
                    </td>
                    <SelectProductivity name={'complexscreen' } states = {changeval} value={name} />
                </tr>
                <tr>
                    <td>
                        Simple Screen
                    </td>
                    <SelectProductivity name={'simplescreen' } states = {changeval} value={name} />
                </tr>
                <tr>
                    <td>
                        Complex Database
                    </td>
                    <SelectProductivity name={'complexdatabase' } states = {changeval} value={name} />
                </tr>
                <tr>
                    <td>
                        Simple Database
                    </td>
                    <SelectProductivity name={'simpledatabase' } states = {changeval} value={name} />
                </tr>
                <tr>
                    <td>Complex Api</td>
                    <SelectProductivity name={'complexapi'} states = {changeval} value={name} />
                </tr>
                <tr>
                    <td>Simple Api</td>
                    <SelectProductivity name={'simpleapi'} states = {changeval} value={name} />
                </tr>
               <tr>
                    <td>Complex Report</td>
                    <SelectProductivity name={'complexreport'} states = {changeval} value={name} />
                </tr>
                <tr>
                    <td>Simple Report</td>
                    <SelectProductivity name={'simplereport'} states = {changeval} value={name} />
                </tr>
            </tbody>
            </table>
            
        </>
    )
}

export default Productivity