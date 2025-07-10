import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import banner from "./Images/daytonSign.jpg";
import image1 from "./Images/article1Image.jpg";
import image2 from "./Images/article2Image.jpg";
import image3 from "./Images/article3Image.jpg";

function Home() {
    const [aboutText, setAboutText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [articles, setArticles] = useState([
        {
            title: "The Trial",
            image: image1,
            textFile: "/DaytonLeader/article1Text.txt",
            text: "",
            author: "Justine Hemmestad",
            date: "2025-07-09T08:00:00",
        },
        {
            title: "Knowing Your Community",
            image: image2,
            textFile: "/DaytonLeader/article2Text.txt",
            text: "",
            author: "Justine Hemmestad",
            date: "2025-07-02T08:00:00",
        },
        {
            title: "Knowing Your Community",
            image: image2,
            textFile: "/DaytonLeader/article2Text.txt",
            text: "",
            author: "Justine Hemmestad",
            date: "2025-07-02T08:00:00",
        },
    ]);

    const handleClose = () => {
        setShowModal(false);
        setSelectedArticle(null);
    };

    const handleOpen = (article) => {
        setSelectedArticle(article);
        setShowModal(true);
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    useEffect(() => {
        fetch('/DaytonLeader/aboutText.txt')
            .then((response) => response.text())
            .then((text) => setAboutText(text));
    }, []);

    useEffect(() => {
        Promise.all(
            articles.map((articles) =>
                fetch(articles.textFile)
                    .then((res) => res.text())
                    .then((text) => ({ ...articles, text }))
            )
        ).then((updatedArticles) => {
            setArticles(updatedArticles);
        });
    }, []);

    return (
        <div>
            <div
                className="home-banner"
                style={{
                    width: '100%',
                    aspectRatio: '30 / 9',
                    backgroundImage: `url(${banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>
            <div className="about centered m-3 p-3">
                <div className="col">
                    <h3>
                        <strong className="title large-font">The Dayton Leader</strong>
                    </h3>
                    <p style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: aboutText }}></p>
                    <a className="btn" href="https://jhdaytonleader.wixsite.com/israelatwar/news" target="_blank" rel="noopener noreferrer" role="button">Link</a>
                </div>
            </div>
            <div className="article-divider d-flex align-items-center m-3">
                <div className="flex-grow-1 line-left" />
                <span className="px-3 title">Featured</span>
                <div className="flex-grow-1 line-right" />
            </div>
            <div className="text-center m-3 p-3">
                <div
                    className="article-image" style={{ backgroundImage: `url(${articles[0].image})` }}
                ></div>
                <div>
                    <h5 className="article-title">{articles[0].title}</h5>
                    <p className="card-text article-content article-content-fade">{articles[0].text}</p>
                    <p className="card-text"><strong>By {articles[0].author}</strong></p>
                    <button onClick={() => handleOpen({
                        title: articles[0].title,
                        image: articles[0].image,
                        text: articles[0].text,
                        author: articles[0].author
                    })} className="btn">Read More</button>
                </div>
                <div className="card-footer text-muted">
                    {getRelativeTime(articles[0].date)}
                </div>
            </div>
            <div className="article-divider d-flex align-items-center m-3">
                <div className="flex-grow-1 line-left" />
                <span className="px-3 title">More</span>
                <div className="flex-grow-1 line-right" />
            </div>
            <div className="row justify-content-center">
                <div className="col-sm-5 p-3 m-3">
                    <div
                        className="article-image" style={{ backgroundImage: `url(${articles[1].image})` }}
                    ></div>
                    <div>
                        <h5 className="article-title">{articles[1].title}</h5>
                        <p className="card-text article-content article-content-fade">{articles[1].text}</p>
                        <p className="card-text"><strong>By {articles[1].author}</strong></p>
                        <button onClick={() => handleOpen({
                            title: articles[1].title,
                            image: articles[1].image,
                            text: articles[1].text,
                            author: articles[1].author
                        })} className="btn">Read More</button>
                    </div>
                    <div className="card-footer text-muted">
                        {getRelativeTime(articles[1].date)}
                    </div>
                </div>
                <div className="col-sm-5 p-3 m-3">
                    <div
                        className="article-image" style={{ backgroundImage: `url(${articles[2].image})` }}
                    ></div>
                    <div>
                        <h5 className="article-title">{articles[2].title}</h5>
                        <p className="card-text article-content article-content-fade">{articles[2].text}</p>
                        <p className="card-text"><strong>By {articles[2].author}</strong></p>
                        <button onClick={() => handleOpen({
                            title: articles[2].title,
                            image: articles[2].image,
                            text: articles[2].text,
                            author: articles[2].author
                        })} className="btn">Read More</button>
                    </div>
                    <div className="card-footer text-muted">
                        {getRelativeTime(articles[2].date)}
                    </div>
                </div>
                {showModal && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title article-title">{selectedArticle.title}</h5>
                                    <button type="button" className="btn-close" onClick={handleClose}></button>
                                </div>
                                <div className="modal-body text-center">
                                    <img src={selectedArticle.image} alt="Article" style={{ maxHeight: '400px', maxWidth: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
                                    <p>{selectedArticle.text}</p>
                                    <p><strong>By {selectedArticle.author}</strong></p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn" onClick={handleClose}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Home;

function getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days === 0) {
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `Just now`;
    }

    if (days === 1) return `1 day ago`;
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;

    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
}