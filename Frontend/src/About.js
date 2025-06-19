import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Griffin from "./Images/griffin.jpg"
import Caleb from "./Images/caleb.jpg"

function About() {
    const [aboutMovieReview, setAboutMovieReview] = useState('');
    return(
    <div>
        <h1>About</h1>
        <div class="row mb-3 text-center">
            <div class="col-3 themed-grid-col" style={{backgroundSize: 'cover'}}>
                <img src={Caleb} style={{maxWidth: "300px"}}></img>
            </div>
            <div class="col-8 themed-grid-col" style={{borderRadius: "2%"}}>
                <h3><strong>About Caleb</strong></h3>
                <p style={{color: "#FFFFFF"}}>I am a Senior majoring in Software Engineering and minoring in Cyber Security.
                    I am currently enrolled in SE 319 which is called Construction of User Interfaces
                    and teaches you about making websites and is instructed by Dr. Abraham Aldaco.<br/>
                    You can reach me at cihem@iastate.edu<br/>


                    Date : 12/11/2024</p>
            </div>
        </div>
        <div class="row mb-3 text-center">
            <div class="col-8 themed-grid-col" style={{borderRadius: '2%'}}> 
                <h3><strong>About Griffin</strong></h3>
                <p style={{color: "#FFFFFF"}}>Hi im Griffin! I'm a junior in software engineering.<br/>Im currently taking SE/ComS319 Construction of User Interfaces for Fall 2024.<br/>You can reach me at griffinu@iastate.edu<br/>Date : 12/11/2024</p>
            </div>
            <div class="col-3 themed-grid-col" style={{backgroundSize: 'cover'}}>
                <img src={Griffin} style={{maxWidth: "300px"}}></img>
            </div>
        </div>
    </div>);
}

export default About;