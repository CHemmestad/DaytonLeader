import React, { useEffect, useState } from 'react';
import './Columns.css';
import { getVhPx } from '../utils/viewportUtils.js';
import { ColumnData } from './ColumnData';
import background from "../Images/Backgrounds/ryannsReviews.png";
import headshot from "../Images/HeadShots/Ryann1nb.png";
import title from "../Images/Titles/ryannsReviews.png"

const Review = () => {
    // const [content, setContent] = useState('');
    const column = ColumnData("Review", "Ryann Shipley");
    const textColor = 'white'

    // const column = {
    //     title: "New Pizza Shop Down the Street",
    //     author: "Ryann Shipley",
    //     date: "July 15, 2025",
    //     contentPath: "/DaytonLeader/columns/demo.txt"
    // };

    // useEffect(() => {
    //     fetch(column.contentPath)
    //         .then((res) => res.text())
    //         .then((text) => setContent(text))
    // }, []);

    return (
        <div
            style={{
                height: '100%',
                backgroundImage: `url(${background})`,
                backgroundRepeat: 'repeat-y',
                backgroundSize: '100% auto',
                backgroundPosition: 'bottom center',
                backgroundAttachment: 'fixed',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div className="container d-flex flex-column flex-grow-1 align-items-center">
                <header className="header">
                    <img className="image" src={title} />
                </header>
                <div className="flex-grow-1 p-4" style={{ width: '100%', marginBottom: '15vh' }}>
                    <h3 className="title outline mb-2">{column.title}</h3>
                    <p className="mb-3" style={{ color: textColor }}>By {column.author} - {column.date}</p>
                    <div className="content glass" style={{ color: textColor }}>
                        {column.content
                            .split('\n\n') // split into paragraphs on double line breaks
                            .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                    </div>
                </div>
                <footer className="footer glass" style={{ height: getVhPx(20) }}>
                    <div className="footer-left no-overflow">
                        <div className="author-name">{column.author}</div>
                        <p style={{ color: textColor }}>Hi, my name is Ryann Shipley. 
                            I am the daughter of Robert and Jami Shipley, owners of the Dayton Veterinary Clinic. 
                            I am currently a sophomore at Des Moines Area Community College (DMACC), while also taking dual credits at lowa State University. 
                            I am majoring in Animal Science Pre-Vet, with a minor in Geology. 
                            I have lived in Dayton with my family since 2007 and have grown up with the Dayton Public Library. 
                            Growing up with a love of reading and writing, I would spend hours at the library finding my next read. 
                            I'm thrilled to share my passion and love for the library and all it has to give by using this opportunity to write reviews for some of the amazing books offered by our local library.</p>
                    </div>
                    <img src={headshot} className="footer-img" alt="Footer Image" />
                </footer>
            </div>
        </div>
    );
};

export default Review;
