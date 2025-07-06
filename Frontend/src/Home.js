import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import banner from "./Images/daytonSign.jpg";
import featured from "./Images/featuredImage.jpg";

function Home() {
    const [aboutText, setAboutText] = useState('');
    const [featuredArticle, setFeaturedArticle] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

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
        fetch('aboutText.txt')
            .then((response) => response.text())
            .then((text) => setAboutText(text));
        fetch('featuredArticleText.txt')
            .then((response) => response.text())
            .then((text) => setFeaturedArticle(text));
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
                    <p style={{ whiteSpace: 'pre-line' }}>{aboutText}</p>
                    <a className="btn" style={{ backgroundColor: '#570335', color: 'white' }} href="https://jhdaytonleader.wixsite.com/israelatwar/news" target="_blank" rel="noopener noreferrer" role="button">Link</a>
                </div>
            </div>
            <div className="article-divider d-flex align-items-center m-3">
                <div className="flex-grow-1 line-left" />
                <span className="px-3 title">Featured</span>
                <div className="flex-grow-1 line-right" />
            </div>
            <div className="text-center m-3 p-3">
                <div
                    className="article-image" style={{ backgroundImage: `url(${featured})` }}
                ></div>
                <div>
                    <h5 className="article-title">Knowing Your Community</h5>
                    <p className="card-text article-content article-content-fade">{featuredArticle}</p>
                    <p className="card-text"><strong>By Justine Hemmestad</strong></p>
                    <a onClick={handleOpen} className="btn" style={{ backgroundColor: '#570335', color: 'white' }}>Read More</a>
                </div>
                <div className="card-footer text-muted">
                    2 days ago
                </div>
            </div>
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title article-title">Knowing Your Community</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={featured} alt="Article" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
                                <p>{featuredArticle}</p>
                                <p><strong>By Justine Hemmestad</strong></p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="article-divider d-flex align-items-center m-3">
                <div className="flex-grow-1 line-left" />
                <span className="px-3 title">More</span>
                <div className="flex-grow-1 line-right" />
            </div>
            <div className="row justify-content-center">
                <div className="col-sm-5 p-3 m-3">
                    <div
                        className="article-image" style={{ backgroundImage: `url(${banner})` }}
                    ></div>
                    <div>
                        <h5 className="article-title">Special title treatment</h5>
                        <p className="card-text article-content article-content-fade">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn" style={{ backgroundColor: '#570335', color: 'white' }}>Read More</a>
                    </div>
                    <div className="card-footer text-muted">
                        2 days ago
                    </div>
                </div>
                <div className="col-sm-5 p-3 m-3">
                    <div
                        className="article-image" style={{ backgroundImage: `url(${banner})` }}
                    ></div>
                    <div>
                        <h5 className="article-title">Special title treatment</h5>
                        <p className="card-text article-content article-content-fade">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn" style={{ backgroundColor: '#570335', color: 'white' }}>Read More</a>
                    </div>
                    <div className="card-footer text-muted">
                        2 days ago
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;