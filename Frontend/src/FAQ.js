import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function FAQ() {
    const [aboutMovieReview, setAboutMovieReview] = useState('');

    return( <main>
        <h1>FAQs</h1>
    
        <section className="faq-section">
          <div className="container my-5">
            <div className="accordion" id="faqAccordion">
              
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
                    What is this website about?
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse show" aria-labelledby="headingOne"
                  data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    This website provides movie reviews, ratings, and information about different genres of films. You can
                    explore movies by genre, check out reviews, and discover new films to watch.
                  </div>
                </div>
              </div>
    
              
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    How do I find movies by genre?
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse" aria-labelledby="headingTwo"
                  data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    You can navigate to the "Movies" section from the navigation bar and choose a genre, such as Action,
                    Thriller, Animated, or Comedy. The movies will be displayed in card format for each genre.
                  </div>
                </div>
              </div>
    
              
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    How are movie ratings determined?
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse" aria-labelledby="headingThree"
                  data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    Movie ratings are based on user reviews, critic scores, and a combination of factors such as storyline,
                    acting, and cinematography.
                  </div>
                </div>
              </div>
    
              
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFour">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    Who made this website?
                  </button>
                </h2>
                <div id="collapseFour" className="accordion-collapse" aria-labelledby="headingFour"
                  data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    This webpage was made by two Iowa State students, Caleb and Griffin. You can find more about them if you navigate to the "About" section from the navigation bar.
                  </div>
                </div>
              </div>
    
              
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFive">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                    Is there a subscription fee to access the reviews?
                  </button>
                </h2>
                <div id="collapseFive" className="accordion-collapse" aria-labelledby="headingFive"
                  data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    No! our website is completely free to use. You can access all movie reviews and content without any subscription fees.
                  </div>
                </div>
              </div>
    
              
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingSix">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                    How can I contact the support team?
                  </button>
                </h2>
                <div id="collapseSix" className="accordion-collapse" aria-labelledby="headingSix"
                  data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    You can find the emails of our team in the "About" section from the navigation bar. Please be lable the subject heading "MOVIE REVIEWS SUPPORT" and we will get back to you as soon as possible.
                  </div>
                </div>
              </div>
    
              
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingSeven">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                    Are the movies available for streaming directly on your site?
                  </button>
                </h2>
                <div id="collapseSeven" className="accordion-collapse" aria-labelledby="headingSeven"
                  data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    No, we do not host movies for streaming. Our site provides reviews and links to where you can watch them on authorized streaming platforms.
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>);
}

export default FAQ;