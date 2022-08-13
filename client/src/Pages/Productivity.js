import React from "react";
import Select from 'react-select'
import SelectProductivity from "./SelectProductivity";
function Productivity(){
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
                    <SelectProductivity name={'complexscreen' } />
                </tr>
                <tr>
                    <td>
                        Simple Screen
                    </td>
                    <SelectProductivity name={'simplescreen' } />
                </tr>
                <tr>
                    <td>
                        Complex Database
                    </td>
                    <SelectProductivity name={'complexdatabase' } />
                </tr>
                <tr>
                    <td>
                        Simple Database
                    </td>
                    <SelectProductivity name={'simpledatabase' } />
                </tr>
                <tr>
                    <td>Complex Api</td>
                    <SelectProductivity name={'complexapi'} />
                </tr>
                <tr>
                    <td>Simple Api</td>
                    <SelectProductivity name={'simpleapi'} />
                </tr>
               <tr>
                    <td>Complex Report</td>
                    <SelectProductivity name={'complexreport'} />
                </tr>
                <tr>
                    <td>Simple Report</td>
                    <SelectProductivity name={'simplereport'} />
                </tr>
            </tbody>
            </table>
            
        </>
    )
}

export default Productivity