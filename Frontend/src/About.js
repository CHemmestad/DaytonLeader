import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./Images/logo.jpg"

function About() {
    const [aboutMovieReview, setAboutMovieReview] = useState('');
    return(
    <div>
        <h1>About</h1>
        <div class="row mb-3 text-center">
            <div class="col-3 themed-grid-col" style={{backgroundSize: 'cover'}}>
                <img src={logo} style={{maxWidth: "100%"}}></img>
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
            <div class="col-8 themed-grid-col" style={{borderRadius: "2%"}}>
                <h3><strong>About Caleb</strong></h3>
                <p style={{color: "#FFFFFF"}}>I am a Senior majoring in Software Engineering and minoring in Cyber Security.
                    I am currently enrolled in SE 319 which is called Construction of User Interfaces
                    and teaches you about making websites and is instructed by Dr. Abraham Aldaco.<br/>
                    You can reach me at cihem@iastate.edu<br/>

                    Date : 12/11/2024</p>
            </div>
            <div class="col-3 themed-grid-col" style={{backgroundSize: 'cover'}}>
                <img src={logo} style={{maxWidth: "100%"}}></img>
            </div>
        </div>
    </div>);
}

export default About;