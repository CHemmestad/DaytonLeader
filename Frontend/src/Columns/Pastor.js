import React, { useEffect, useState } from 'react';
import './Columns.css';
import { getVhPx } from '../utils/viewportUtils.js';
import { ColumnData } from './ColumnData';
import background from "../Images/Backgrounds/pastorKay.png";
import headshot from "../Images/HeadShots/Justine1nb.png";
import title from "../Images/Titles/pastorKay.png"

const Pastor = () => {
    // const [content, setContent] = useState('');
    const column = ColumnData("Pastor", "Pastor Kay");
    const textColor = 'black'

    // const column = {
    //     title: "Pray Every Day",
    //     author: "Pastor Kay",
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
                        <p style={{ color: textColor }}>Pastor Kay serves the United Methodist Churches of Dayton and Harcourt as a full-time pastor and feels very honored to be in this role.
                            She also serves as Chaplain for the police, fire, ambulance, and school system, as well as most of Southern Webster County.
                            Pastor Kay enjoys writing poetry and short stories, as well as using artistic mediums such as pencil drawing, acrylic paints, and wood.</p>
                    </div>
                    {/* <img src={headshot} className="footer-img" alt="Footer Image" /> */}
                </footer>
            </div>
        </div>
    );
};

export default Pastor;
