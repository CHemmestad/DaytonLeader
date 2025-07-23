import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import ScrollToTop from './ScrollToTop.js';
import reportWebVitals from './reportWebVitals.js';
import SideBar from "./SideBar.js";
import Expired from "./ExpiredHeader.js";
import Footer from "./Footer.js";
import Home from "./Home.js";
import CreateAccount from "./CreateAccount.js";
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
import Setting from "./Setting.js";
import User from "./User.js";
import Edit from "./Edit.js";
import { CheckoutForm, Return } from './Checkout';
// import { useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);
  // const [userRole, setUserRole] = useState("user");
  // const [userRole, setUserRole] = useState("admin");
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);

  const constRoutes = [
    { path: "/", element: <Home username={username}/> },
    { path: "/create-account/:token", element: <CreateAccount setUserRole={setUserRole} setUsername={setUsername}/> },
    { path: "/paper", element: <Paper userRole={userRole} /> },
    { path: "/subscribe", element: <Subscribe /> },
    { path: "/picture", element: <Picture /> },
    { path: "/contact", element: <Contact /> },
    { path: "/about", element: <About /> },
    { path: "/checkout", element: <CheckoutForm /> },
    { path: "/return", element: <Return /> },
  ]

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

  const expiredRoutes = [
    { path: "/setting", element: <Setting userRole={userRole} /> },
  ]

  const adminOrUserRoutes = [
    { path: "/game", element: <Game /> },
    { path: "/setting", element: <Setting userRole={userRole} /> },
  ]

  const adminRoutes = [
    { path: "/user", element: <User /> },
    { path: "/edit", element: <Edit /> },
  ]

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <div className="d-flex">
          <SideBar userRole={userRole} setUserRole={setUserRole} usernameReal={username} setUsernameReal={setUsername} />
          <div className="flex-grow-1 d-flex flex-column">
            {userRole === "expired" && (
              <Expired />
            )}
            <div className="flex-grow-1">
              <Routes>
                {constRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                {columnRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                {userRole === "expired" && (
                  expiredRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))
                )}
                {(userRole === "admin" || userRole === "user") && (
                  adminOrUserRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))
                )}
                {userRole === "admin" && (
                  adminRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <Footer />
          </div>
          {(userRole !== "user" && userRole !== "admin") && <AdBar />}
        </div>
      </Router>
    </div>
  );
}

export default App;
