import React, { useEffect, useState } from 'react';
import './Columns.css';
import { getVhPx } from '../utils/viewportUtils.js';
import background from "../Images/Backgrounds/liberalLibrarian.jpg";
import headshot from "../Images/HeadShots/Courtney1nb.png";
import title from "../Images/Titles/liberalLibrarian.png"

const Librarian = () => {
    const [content, setContent] = useState('');

    const column = {
        title: "The Evolution of Public Libraries in the Digital Age",
        author: "Courtney Sogard",
        date: "July 12, 2025",
        contentPath: "/DaytonLeader/columns/demo.txt"
    };

    useEffect(() => {
        fetch(column.contentPath)
            .then((res) => res.text())
            .then((text) => setContent(text))
    }, []);

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
                    <p className="mb-3" style={{color: 'black'}}>By {column.author} — {column.date}</p>
                    <div className="content glass">
                        {content
                            .split('\n\n') // split into paragraphs on double line breaks
                            .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                    </div>
                </div>
                <footer className="footer glass" style={{ height: getVhPx(20) }}>
                    <div className="footer-left">
                        <div className="outline author-name">{column.author}</div>
                        <p>Courtney Sogard has a Bachelor's in Secondary Education from Buena Vista University.<br />
                            She is currently the Library Director at both Dayton and Harcourt Public Libraries.</p>
                    </div>
                    <img src={headshot} className="footer-img" alt="Footer Image" />
                </footer>
            </div>
        </div>
    );
};

export default Librarian;