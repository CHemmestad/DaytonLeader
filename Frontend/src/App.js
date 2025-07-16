import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import ScrollToTop from './ScrollToTop.js';
import reportWebVitals from './reportWebVitals.js';
import SideBar from "./SideBar.js";
import AddContact from "./AddContacts.js";
import SearchContact from "./SearchContacts.js";
import NewMessage from "./NewMessages.js";
import Home from "./Home.js";
import About from "./About.js";
import AdBar from "./AdBar.js";
import Paper from "./Paper.js";
import Game from "./Game.js";
import Subscribe from "./Subscribe.js";
import Israel from "./Columns/Israel.js";
import Librarian from "./Columns/Librarian.js";
import Conservative from "./Columns/Conservative.js";
import Review from "./Columns/Review.js";
import Coffee from "./Columns/Coffee.js";
import Therapy from "./Columns/Therapy.js";
import Historical from "./Columns/Historical.js";
import Readers from "./Columns/Readers.js";
import Local from "./Columns/Local.js";
import Pastor from "./Columns/Pastor.js";
import Picture from "./Picture.js";
import Contact from "./Contact.js";
import { CheckoutForm, Return } from './Checkout';
// import { useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);
  const [userRole, setUserRole] = useState("user");
  // const [userRole, setUserRole] = useState("admin");
  // const [userRole, setUserRole] = useState(null);
  const columnRoutes = [
    { path: "/columns/war", element: <Israel /> },
    { path: "/columns/libs", element: <Librarian /> },
    { path: "/columns/break", element: <Coffee /> },
    { path: "/columns/conserv", element: <Conservative /> },
    { path: "/columns/ryann", element: <Review /> },
    { path: "/columns/therapy", element: <Therapy /> },
    { path: "/columns/hist", element: <Historical /> },
    { path: "/columns/readers", element: <Readers /> },
    { path: "/columns/eats", element: <Local /> },
    { path: "/columns/pastor", element: <Pastor /> },
  ];

  // const columns = [
  //   { title: "Israel At War", path: "/war" }, 
  //   { title: "Historical Perspective", path: "/hist" },
  //   { title: "Readers Corner", path: "/readers" },
  //   { title: "Coffee Break", path: "/break" },
  //   { title: "Coffee Therapy", path: "/therapy" },
  //   { title: "Conservative Corner", path: "/conserv" },
  //   { title: "Ryan's Reviews", path: "/ryan" },
  //   { title: "Liberal Librarian", path: "/libs" },
  //   { title: "Local Eats", path: "/eats" },
  //   { title: "Pastor Kay", path: "/kay" },
  // ];

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <div className="d-flex">
          <SideBar userRole={userRole} setUserRole={setUserRole} />
          <div className="flex-grow-1 d-flex flex-column">
            <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/paper" element={<Paper userRole={userRole} />} />
                <Route path="/game" element={<Game />} />
                <Route path="/subscribe" element={<Subscribe />} />
                {columnRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                <Route path="/picture" element={<Picture />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                {userRole === "admin" && (
                  <>
                    <Route path="/add-contact" element={<AddContact contacts={contacts} setContacts={setContacts} />} />
                    {/* <Route path="/updatecontact" element={<UpdateContact contacts={contacts} setContacts={setContacts} />} /> */}
                  </>
                )}
                <Route path="/checkout" element={<CheckoutForm />} />
                <Route path="/return" element={<Return />} />
              </Routes>
            </div>
            <footer className="p-2 text-center">
              <p style={{ margin: '0px' }}>Copyright © {new Date().getFullYear()} The Dayton Leader - All Rights Reserved.</p>
              <div>
                <a
                  href="https://www.facebook.com/daytonleader"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="me-3"
                  style={{color: '#570335'}}
                >
                  <i class="bi bi-facebook fs-3"></i>
                </a>
                <a
                  href="https://www.instagram.com/daytonleader/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="me-3"
                  style={{color: '#570335'}}
                >
                  <i class="bi bi-instagram fs-3"></i>
                </a>
              </div>
            </footer>
          </div>
          {(userRole !== "user" && userRole !== "admin") && <AdBar />}
        </div>
      </Router>
    </div>
  );
}

export default App;
