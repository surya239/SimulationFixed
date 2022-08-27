import React,{useEffect, useState} from "react";
import axios from "axios";
import Contigency from "./Contigency";
import TotalContigency from './TotalContigency'
import BidPrice from "./BidPrice";
function SelectContigency(){
    return(
        <>
        <div className='Dash'>
            <div className='n'>
                <h1>Contigency</h1>

            </div>
            <div className='n'>
                <BidPrice />
            </div>
        </div>
        <div className="effort">
        <table>
                <thead>
                    <tr  className="thead" >
                    <th className="subsecond" >Module</th>
                    <th className="subfirst">Risk Rating</th>
                    
                    {/* <th>Inhouse Risk Impact</th>
                    <th>Subcontract Risk Rating</th>
                    <th>Subcontract Risk Rating Impact</th>
                   <th>Contigency</th> */}
                </tr>
                   
                </thead>
                <tbody>
                    <tr className="tbody" >
                    <Contigency name='requirement' module='Requiremeent'></Contigency><br></br>
                    </tr>
                    <tr className="tbody" >
                    <Contigency name='design' module = 'Design'></Contigency><br></br>
                    </tr>
                    <tr className="tbody" >
                    <Contigency name='coding' module='Coding'></Contigency><br></br>
                    </tr>
                    <tr className="tbody">
                    <Contigency name='testing' module='Testing' ></Contigency><br></br>
                    </tr>
                    <tr className="tbody">
            <Contigency name='deployment' module='Deployment' ></Contigency><br></br>
                    </tr>
                    {/* <tr>
                        <TotalContigency />
                    </tr> */}
                </tbody>
            </table>
            </div> 
        </>
    )
}

export default SelectContigency