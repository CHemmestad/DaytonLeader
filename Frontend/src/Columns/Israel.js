import React, { useEffect, useState } from 'react';
import './Columns.css';
import { getVhPx } from '../utils/viewportUtils.js';
import { ColumnData } from './ColumnData';
import background from "../Images/Backgrounds/israelAtWar.png";
import headshot from "../Images/HeadShots/Justine1nb.png";
import title from "../Images/Titles/israelAtWar.png"

const Israel = () => {
    // const [content, setContent] = useState('');
    const column = ColumnData("Israel", "Justine Hemmestad");
    const textColor = 'white'

    // const defaultColumn = {
    //     title: "Loading...",
    //     author: "Justine Hemmestad",
    //     date: "Loading...",
    //     content: "Loading...",
    // };

    // const failedFetchColumn = {
    //     title: "Could not load title",
    //     author: "Justine Hemmestad",
    //     date: "Unavailable",
    //     content: "We're sorry, this article could not be retrieved at this time.",
    // };

    // const [column, setColumn] = useState(defaultColumn);

    // useEffect(() => {
    //     fetch(column.contentPath)
    //         .then((res) => res.text())
    //         .then((text) => setContent(text))
    // }, []);

    // useEffect(() => {
    //     fetch('http://0.0.0.0:8081/columns/Israel%20at%20War')
    //         .then((res) => res.ok ? res.json() : Promise.reject('Not found'))
    //         .then((data) => {
    //             setColumn((prev) => ({
    //                 ...prev,
    //                 title: data.title || prev.title,
    //                 date: data.date
    //                     ? new Date(data.date).toLocaleDateString('en-US', {
    //                         year: 'numeric',
    //                         month: 'long',
    //                         day: 'numeric',
    //                     })
    //                     : prev.date,
    //                 content: data.content || prev.content,
    //             }));
    //         })
    //         .catch(() => {
    //             console.warn("Using fallback content (failed to fetch from DB)");
    //             setColumn(failedFetchColumn);
    //         });
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
                    <a className="btn m-3" href="https://jhdaytonleader.wixsite.com/israelatwar/news" target="_blank" rel="noopener noreferrer" role="button">Israel</a>
                    <a className="btn m-3" href="https://blogs.timesofisrael.com/author/justine-johnston-hemmestad/" target="_blank" rel="noopener noreferrer" role="button">Blog</a>
                    <div className="content glass" style={{ color: textColor }}>
                        {column.content
                            .split('\n\n') // split into paragraphs on double line breaks
                            .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                    </div>
                </div>
                <footer className="footer glass" style={{ height: getVhPx(20) }}>
                    <div className="footer-left no-overflow">
                        <div className="author-name">{column.author}</div>
                        <p style={{ color: textColor }}>Justine Hemmestad is an author of three novels and a contributor to 18 anthologies.<br />
                            She has Master's Degree in English Literature.</p>
                    </div>
                    <img src={headshot} className="footer-img" alt="Footer Image" />
                </footer>
            </div>
        </div>
    );
};

export default Israel;
