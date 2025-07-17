import React, { useEffect, useState } from 'react';
import './Columns.css';
import { getVhPx } from '../utils/viewportUtils.js';
import { ColumnData } from './ColumnData';
import background from "../Images/Backgrounds/coffeeBreak.png";
import headshot from "../Images/HeadShots/Kendra1nb.png";
import title from "../Images/Titles/coffeeBreak.png"

const Librarian = () => {
    // const [content, setContent] = useState('');
    const column = ColumnData("Coffee", "Kendra Breitsprecher");

    // const column = {
    //     title: "The First Break of the Summer with COFFEE!",
    //     author: "Kendra Breitsprecher",
    //     date: "July 12, 2025",
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
                    <p className="mb-3" style={{color: 'white'}}>By {column.author} - {column.date}</p>
                    <div className="content glass" style={{color: 'white'}}>
                        {column.content
                            .split('\n\n') // split into paragraphs on double line breaks
                            .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                    </div>
                </div>
                <footer className="footer glass" style={{ height: getVhPx(20) }}>
                    <div className="footer-left">
                        <div className="outline author-name">{column.author}</div>
                        <p style={{color: 'white'}}>Kendra has been teaching since God was a boy and been writing even longer than that.</p>
                    </div>
                    <img src={headshot} className="footer-img" alt="Footer Image" />
                </footer>
            </div>
        </div>
    );
};

export default Librarian;