import React,{useEffect, useState} from "react";
import axios from "axios";
import Contigency from "./Contigency";

function SelectContigency(){
    return(
        <>
        <table>
                <thead>
                    <tr>
                    <th>Risk Rating</th>
                    <th>Module</th>
                    <th>Inhouse Risk Impact</th>
                   <th>Contigency</th>
                </tr>
                   
                </thead>
                <tbody>
                    <tr>
                    <Contigency name='requirement' module='Requiremeent'></Contigency><br></br>
                    </tr>
                    <tr>
                    <Contigency name='design' module = 'Design'></Contigency><br></br>
                    </tr>
                    <tr>
                    <Contigency name='coding' module='Coding'></Contigency><br></br>
                    </tr>
                    <tr>
                    <Contigency name='testing' module='Testing' ></Contigency><br></br>
                    </tr>
                    <tr>
            <Contigency name='deployment' module='Deployment' ></Contigency><br></br>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default SelectContigency