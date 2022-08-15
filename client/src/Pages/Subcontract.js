import React from "react";
import SubModule from "./SubModule";
import SubcontractModule from "./SubcontractModule";
import SelectSubCon from "./SelectSubCon";
function Subcontract(){
    return(
        <>
            {/* <h1>Hello</h1> */}
            <table>
                <tbody>
                    <tr>
                        <th>Sub Contract Cost</th>
                        <th>Discount-Premium Table</th>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Module</td>
                        <td>Subcontract - 1</td>
                        <td>Subcontract - 2</td>
                        <td>Subcontract - 3</td>
                    </tr>
                    <tr>
                        <td></td>
                        <SubModule name='Design' />
                        
                    </tr>
                    <tr>
                        <td></td>
                        <SubModule name='Coding' />
                    </tr>
                    <tr>
                        <td></td>
                        <SubModule name='Testing' />
                    </tr>
                    <tr>
                        <td></td>
                        <SubModule name='Deployment' /> 
                    </tr>
                    <tr>
                        <td></td>
                        <SubModule name='Riskrating' /> 
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Module</td>
                        <td>Subcontract - 1</td>
                        <td>Subcontract - 2</td>
                        <td>Subcontract - 3</td>
                    </tr>             
                    <tr>
                        <td></td>
                        <td>Design</td>
                        <SubcontractModule name='design' />
                    </tr>
                    <tr>
                        <td></td>
                        <td>Coding</td>
                        <SubcontractModule name='coding' />
                    </tr>
                    <tr>
                        <td></td>
                        <td>Testing</td>
                        <SubcontractModule name='testing' />
                    </tr>
                    <tr>
                        <td></td>
                        <td>Deployment</td>
                        <SubcontractModule name='deployment' />
                    </tr>
                </tbody>
            </table>
            <SelectSubCon />
        </>
    )
}

export default Subcontract